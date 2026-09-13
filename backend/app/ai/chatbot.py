import re
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.schemas.ai import ChatMessage, ChatbotResponse

class AIChatbot:
    """
    Intelligent chatbot for KamStore SaaS.
    Provides assistance for Tourism, Housing, Scraping, Payments (MTN/Orange via Notch Pay & Campay),
    and lead extraction in Cameroon.
    """

    def __init__(self):
        self.openai_key = settings.openai_api_key

    async def get_response(
        self,
        message: str,
        history: Optional[List[ChatMessage]] = None,
        context_type: str = "general"
    ) -> ChatbotResponse:
        message_lower = message.lower()

        # If OpenAI key configured, we can use OpenAI
        if self.openai_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.openai_key)
                system_prompt = (
                    "Tu es l'assistant IA de KamStore SaaS, une plateforme tout-en-un pour le Cameroun et l'Afrique. "
                    "Tu aides les utilisateurs avec le tourisme (Kribi, Limbe, Mont Cameroun), le logement (hôtels, appartements meublés), "
                    "l'extraction de leads commerciaux via IA, le scraping avec rotation de proxy, et les paiements sécurisés MTN MoMo "
                    "et Orange Money via Notch Pay et Campay. Réponds toujours avec courtoisie, précision et enthousiasme."
                )
                messages = [{"role": "system", "content": system_prompt}]
                if history:
                    for h in history[-4:]:
                        messages.append({"role": h.role, "content": h.content})
                messages.append({"role": "user", "content": message})

                res = await client.chat.completions.create(
                    model=settings.openai_model or "gpt-4o-mini",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=300
                )
                reply = res.choices[0].message.content
                suggestions = self._generate_suggestions(message_lower)
                return ChatbotResponse(reply=reply, suggestions=suggestions, model_used="openai-gpt-4o-mini")
            except Exception:
                pass

        # Intelligent local knowledge-based assistant
        reply, suggestions = self._rule_based_chat(message_lower, context_type)
        return ChatbotResponse(
            reply=reply,
            suggestions=suggestions,
            confidence=0.95,
            model_used="kamstore-cameroon-ai"
        )

    def _rule_based_chat(self, msg: str, context: str) -> (str, List[str]):
        # Tourism queries
        if any(w in msg for w in ["tourisme", "visiter", "kribi", "limbe", "chutes", "plage", "safari"]):
            reply = (
                "🌴 Le Cameroun regorge de merveilles touristiques ! "
                "Je vous conseille : \n"
                "- Les **Chutes de la Lobé** à Kribi (les seules chutes au monde se jetant dans l'océan)\n"
                "- Les plages de sable noir et le Mont Cameroun à **Limbe & Buea**\n"
                "- Le Parc National de Waza et les paysages grandioses de l'Extrême-Nord\n"
                "- Le Palais des Sultans Bamoun à Foumban.\n"
                "Vous pouvez explorer et réserver vos activités directement dans notre onglet Tourisme avec paiement Mobile Money !"
            )
            suggestions = ["Voir les hôtels à Kribi", "Réserver une excursion", "Payer avec MTN MoMo"]

        # Housing / Accommodation queries
        elif any(w in msg for w in ["logement", "appartement", "hôtel", "hotel", "meublé", "louer", "dortoir"]):
            reply = (
                "🏠 Nous proposons des hébergements vérifiés à Douala (Bonapriso, Bonamoussadi, Akwa), "
                "Yaoundé (Bastos, Omnisports), Kribi et d'autres villes. "
                "Tous nos logements disposent de Wi-Fi, climatisation, sécurité 24/7 et sont payables instantanément via Orange Money ou MTN MoMo."
            )
            suggestions = ["Appartements à Bonapriso", "Studios à Bastos", "Calculer le tarif pour 3 nuits"]

        # Payment / Mobile Money queries
        elif any(w in msg for w in ["paiement", "payer", "momo", "orange", "notch pay", "campay", "xaf", "cfa"]):
            reply = (
                "💳 KamStore intègre les deux passerelles de paiement líderes en Afrique francophone : **Notch Pay API** et **Campay API** !\n"
                "- **MTN Mobile Money** (+237 67x, 68x, 65x)\n"
                "- **Orange Money Cameroun** (+237 69x, 655-659)\n"
                "Les transactions sont sécurisées, instantanées, vérifiées par signature de webhook et libellées en Francs CFA (XAF)."
            )
            suggestions = ["Tester un paiement Notch Pay", "Tester Campay API", "Voir mes transactions"]

        # Scraping & Proxy queries
        elif any(w in msg for w in ["scraping", "scraper", "proxy", "playwright", "scrapy", "puppeteer", "crawler"]):
            reply = (
                "🕷️ Notre hub de scraping prend en charge les architectures **Scrapy**, **Playwright** et **Puppeteer** avec rotation automatique de proxies !\n"
                "- Rotation d'adresses IP résidentielles et datacenters pour contourner le rate limiting\n"
                "- User-Agents aléatoires et contournement anti-bot\n"
                "- File d'attente asynchrone Celery & Redis pour exécuter des milliers de pages sans bloquer l'API."
            )
            suggestions = ["Lancer un job de scraping", "Vérifier l'état des proxies", "Extraire les leads scrapés"]

        # Lead Extraction & AI NLP queries
        elif any(w in msg for w in ["lead", "extraction", "nlp", "contact", "entreprise", "annuaire", "openai"]):
            reply = (
                "🤖 Notre moteur IA / NLP analyse les textes et pages web pour extraire automatiquement :\n"
                "- Le nom de l'entreprise et la personne de contact\n"
                "- Les numéros camerounais (+237) MTN et Orange validés\n"
                "- Les emails professionnels et adresses géographiques\n"
                "- La classification sectorielle et le score de confiance\n"
                "Exportez facilement vos leads en CSV ou JSON pour vos campagnes commerciales !"
            )
            suggestions = ["Tester l'extraction de leads", "Exporter en CSV", "Voir les catégories de leads"]

        else:
            reply = (
                "Bonjour ! Je suis l'assistant intelligent KamStore 🇨🇲. "
                "Je peux vous accompagner sur la réservation de tourisme et logements, "
                "l'extraction de leads B2B par IA, le scraping avec rotation de proxy, "
                "ou la gestion des paiements sécurisés MTN Mobile Money & Orange Money. Que souhaitez-vous faire aujourd'hui ?"
            )
            suggestions = ["Explorer le Tourisme", "Découvrir les Logements", "Extraire des Leads IA", "Simuler un Paiement MoMo"]

        return reply, suggestions

    def _generate_suggestions(self, msg: str) -> List[str]:
        return ["Explorer le Tourisme", "Découvrir les Logements", "Extraire des Leads IA", "Simuler un Paiement MoMo"]

ai_chatbot = AIChatbot()
