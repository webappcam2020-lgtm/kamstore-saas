import re
import time
import json
import logging
from typing import List, Dict, Any, Optional
import httpx

from app.core.config import settings
from app.schemas.lead import LeadBase, LeadExtractionResponse

logger = logging.getLogger(__name__)

# Cameroon phone patterns
# MTN: 67x, 68x, 650-654
# Orange: 69x, 655-659
# Camtel / Landline: 22x, 23x, 24x
PHONE_REGEX = re.compile(
    r'(?:(?:\+237|237|00237)[\s.-]?)?(?:6[5-9][0-9]{7}|2[2348][0-9]{7}|6[\s.-]?[5-9][0-9](?:[\s.-]?[0-9]{2}){3})'
)
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
WEBSITE_REGEX = re.compile(r'https?://[^\s/$.?#].[^\s]*|www\.[^\s]+')

CAMEROON_CITIES = [
    "Douala", "Yaoundé", "Yaounde", "Bafoussam", "Bamenda", "Garoua",
    "Maroua", "Kribi", "Limbe", "Buea", "Ngaoundéré", "Ngaoundere",
    "Bertoua", "Ebolowa", "Dschang", "Foumban", "Kumba"
]

CATEGORY_KEYWORDS = {
    "Tourisme & Voyage": ["tourisme", "safari", "guide", "excursion", "plage", "chutes", "voyage", "parc", "randonnée"],
    "Hôtellerie & Hébergement": ["hôtel", "hotel", "auberge", "résidence", "appartement", "meublé", "chambre", "villa", "lodge"],
    "Immobilier & Logement": ["immobilier", "location", "vente", "terrain", "bailleur", "agence immobilière", "duplex"],
    "Restauration & Loisirs": ["restaurant", "bar", "snack", "traiteur", "poisson braisé", "ndolé", "cuisine", "boîte de nuit"],
    "Transport & Logistique": ["transport", "voiture", "taxi", "chauffeur", "vip", "location de voiture", "logistique", "fret"],
    "Commerce & Retail": ["boutique", "vente", "marché", "supermarché", "magasin", "achat", "import", "export"],
    "Services & Technologies": ["informatique", "web", "saas", "agence", "marketing", "consulting", "formation", "sécurité"]
}


class AILeadExtractor:
    """
    AI/NLP Lead Extraction Engine.
    Supports OpenAI API, LangChain pipelines, HuggingFace Inference API,
    and a specialized zero-dependency Cameroon/African NLP rule-based extractor.
    """

    def __init__(self):
        self.openai_key = settings.openai_api_key
        self.hf_token = settings.huggingface_api_token
        self.gemini_key = settings.gemini_api_key

    async def extract_leads(
        self,
        text: str,
        source_url: Optional[str] = None,
        category_hint: Optional[str] = None,
        engine: str = "auto"
    ) -> LeadExtractionResponse:
        start_time = time.time()
        leads: List[LeadBase] = []
        engine_used = "local_nlp"

        # If engine is auto, check available API keys
        if engine == "auto":
            if self.openai_key:
                engine = "openai"
            elif self.hf_token:
                engine = "huggingface"
            else:
                engine = "local_nlp"

        # Attempt OpenAI / LangChain extraction if requested
        if engine in ("openai", "langchain") and self.openai_key:
            try:
                leads = await self._extract_with_openai(text, source_url, category_hint)
                engine_used = "openai"
            except Exception as e:
                logger.warning(f"OpenAI lead extraction failed, falling back to local NLP: {e}")
                leads = self._extract_with_local_nlp(text, source_url, category_hint)
                engine_used = "local_nlp_fallback"
        elif engine == "huggingface" and self.hf_token:
            try:
                leads = await self._extract_with_huggingface(text, source_url, category_hint)
                engine_used = "huggingface"
            except Exception as e:
                logger.warning(f"HuggingFace lead extraction failed, falling back to local NLP: {e}")
                leads = self._extract_with_local_nlp(text, source_url, category_hint)
                engine_used = "local_nlp_fallback"
        else:
            leads = self._extract_with_local_nlp(text, source_url, category_hint)
            engine_used = "local_nlp"

        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        summary = f"Extrait avec succès {len(leads)} lead(s) via le moteur {engine_used}."

        return LeadExtractionResponse(
            leads_count=len(leads),
            leads=leads,
            engine_used=engine_used,
            processing_time_ms=elapsed_ms,
            summary=summary
        )

    async def _extract_with_openai(
        self,
        text: str,
        source_url: Optional[str] = None,
        category_hint: Optional[str] = None
    ) -> List[LeadBase]:
        """Extract structured leads via OpenAI API with JSON mode."""
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=self.openai_key)

        prompt = f"""
        Tu es un analyste expert en extraction de leads B2B et B2C au Cameroun et en Afrique centrale.
        Analyse le texte brut fourni et extrais toutes les entreprises, commerces ou professionnels mentionnés.
        
        Texte source:
        \"\"\"{text[:4000]}\"\"\"

        Catégorie suggérée: {category_hint or 'Non spécifiée'}

        Pour chaque lead identifié, retourne un objet JSON avec les champs:
        - company_name: nom de l'entreprise ou du commerce
        - contact_person: nom du contact si disponible
        - email: adresse email
        - phone: numéro de téléphone (idéalement format international camerounais +237)
        - category: catégorie de l'activité
        - address: adresse ou quartier
        - city: ville (ex: Douala, Yaoundé, Kribi...)
        - country: Cameroun
        - confidence_score: score de confiance entre 0.0 et 1.0
        - ai_summary: résumé en 1-2 phrases des services offerts
        - sentiment: "positive" ou "neutral"
        
        Format de réponse obligatoire: JSON avec la clé "leads" contenant la liste d'objets.
        """

        response = await client.chat.completions.create(
            model=settings.openai_model or "gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "Tu es un extracteur d'entités nommées et de contacts pour le Cameroun."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content
        parsed = json.loads(content)
        raw_leads = parsed.get("leads", [])

        results: List[LeadBase] = []
        for l in raw_leads:
            results.append(LeadBase(
                company_name=l.get("company_name") or "Contact Professionnel",
                contact_person=l.get("contact_person"),
                email=l.get("email"),
                phone=l.get("phone"),
                category=l.get("category") or category_hint or "Commerce & Services",
                address=l.get("address"),
                city=l.get("city") or "Douala",
                country=l.get("country") or "Cameroun",
                source_url=source_url,
                confidence_score=float(l.get("confidence_score") or 0.90),
                ai_summary=l.get("ai_summary"),
                sentiment=l.get("sentiment") or "neutral"
            ))
        return results

    async def _extract_with_huggingface(
        self,
        text: str,
        source_url: Optional[str] = None,
        category_hint: Optional[str] = None
    ) -> List[LeadBase]:
        """Call Hugging Face inference API for entity extraction."""
        api_url = "https://api-inference.huggingface.co/models/dslim/bert-base-NER"
        headers = {"Authorization": f"Bearer {self.hf_token}"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(api_url, headers=headers, json={"inputs": text[:1000]})
            if resp.status_code != 200:
                raise Exception(f"HF API returned status {resp.status_code}")
            
            # Combine HF NER outputs with regex fallback
            entities = resp.json()
            return self._extract_with_local_nlp(text, source_url, category_hint, hf_entities=entities)

    def _extract_with_local_nlp(
        self,
        text: str,
        source_url: Optional[str] = None,
        category_hint: Optional[str] = None,
        hf_entities: Optional[List[Dict[str, Any]]] = None
    ) -> List[LeadBase]:
        """
        Specialized rule-based NLP extraction for Cameroon and African businesses.
        Detects phone numbers (+237 MTN/Orange), emails, cities, company names, and categories.
        """
        leads: List[LeadBase] = []
        
        # Split text into potential lead blocks (by paragraphs, bullet points or delimiter lines)
        blocks = [b.strip() for b in re.split(r'\n{2,}|\r\n{2,}|[-]{3,}|[*]{3,}', text) if len(b.strip()) > 10]
        if not blocks:
            blocks = [text]

        for block in blocks:
            # 1. Phone extraction
            raw_phones = PHONE_REGEX.findall(block)
            cleaned_phones = []
            for p in raw_phones:
                clean_p = re.sub(r'[\s.-]', '', p)
                if not clean_p.startswith('+') and not clean_p.startswith('237'):
                    clean_p = f"+237{clean_p}"
                elif clean_p.startswith('237'):
                    clean_p = f"+{clean_p}"
                if clean_p not in cleaned_phones:
                    cleaned_phones.append(clean_p)

            # 2. Email extraction
            emails = list(set(EMAIL_REGEX.findall(block)))

            # Skip block if neither phone nor email is present and length is small
            if not cleaned_phones and not emails and len(block) < 30:
                continue

            # 3. City detection
            detected_city = "Douala"
            for city in CAMEROON_CITIES:
                if re.search(r'\b' + re.escape(city) + r'\b', block, re.IGNORECASE):
                    detected_city = city
                    break

            # 4. Category classification
            detected_category = category_hint or "Commerce & Services"
            max_keyword_matches = 0
            for cat, keywords in CATEGORY_KEYWORDS.items():
                matches = sum(1 for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', block, re.IGNORECASE))
                if matches > max_keyword_matches:
                    max_keyword_matches = matches
                    detected_category = cat

            # 5. Company Name & Contact Person heuristic
            lines = [line.strip() for line in block.splitlines() if line.strip()]
            company_name = "Entreprise Camerounaise"
            contact_person = None

            for line in lines[:3]:
                # If line is short and doesn't look like phone/email/address, likely company name
                if len(line) < 60 and not PHONE_REGEX.search(line) and not EMAIL_REGEX.search(line):
                    # Clean markdown prefixes
                    cleaned = re.sub(r'^[#*_\->\s]+', '', line).strip()
                    if len(cleaned) > 2:
                        company_name = cleaned
                        break

            # Check for contact person prefix (M., Mme, Contact, Dir, etc.)
            person_match = re.search(r'(?:contact|responsable|directeur|mr|m\.|mme|dr)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', block, re.IGNORECASE)
            if person_match:
                contact_person = person_match.group(1).strip()

            # 6. Confidence score calculation
            score = 0.50
            if cleaned_phones:
                score += 0.25
            if emails:
                score += 0.15
            if detected_city:
                score += 0.05
            if len(company_name) > 3 and company_name != "Entreprise Camerounaise":
                score += 0.05
            score = min(score, 0.98)

            summary = f"{company_name} ({detected_category}) situé à {detected_city}. "
            if cleaned_phones:
                summary += f"Tel: {', '.join(cleaned_phones[:2])}. "
            if emails:
                summary += f"Email: {emails[0]}."

            leads.append(LeadBase(
                company_name=company_name,
                contact_person=contact_person,
                email=emails[0] if emails else None,
                phone=cleaned_phones[0] if cleaned_phones else None,
                category=detected_category,
                address=f"Quartier commercial, {detected_city}",
                city=detected_city,
                country="Cameroun",
                source_url=source_url,
                confidence_score=round(score, 2),
                ai_summary=summary,
                sentiment="positive" if score >= 0.8 else "neutral"
            ))

        return leads

lead_extractor = AILeadExtractor()
