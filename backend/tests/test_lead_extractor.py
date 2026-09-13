import pytest
from app.ai.lead_extractor import lead_extractor

@pytest.mark.asyncio
async def test_lead_extraction_cameroon_contacts():
    sample_text = """
    Bienvenue chez Palm Beach Resort & Spa Kribi !
    Notre complexe hôtelier 4 étoiles vous accueille face à l'océan.
    Directeur commercial: Martin Abena
    Téléphone: +237 677 45 67 89 / 699 12 34 56
    Email: reservations@palmbeach-kribi.cm
    Adresse: Boulevard Maritime, Kribi, Cameroun
    """

    res = await lead_extractor.extract_leads(sample_text, source_url="https://palmbeach-kribi.cm")
    assert res.leads_count >= 1
    lead = res.leads[0]
    assert "Palm Beach" in lead.company_name or "Kribi" in lead.company_name
    assert lead.phone is not None
    assert "+237677456789" in lead.phone or "677456789" in lead.phone
    assert lead.email == "reservations@palmbeach-kribi.cm"
    assert lead.city == "Kribi"
    assert lead.confidence_score >= 0.75
    assert lead.category in ("Hôtellerie & Hébergement", "Tourisme & Voyage", "Commerce & Services")

@pytest.mark.asyncio
async def test_lead_extraction_multiple_blocks():
    sample_text = """
    Entreprise 1: Douala Transport Express
    Tel: +237 650 00 11 22
    Email: contact@douala-transport.cm
    Ville: Douala

    ---

    Entreprise 2: Yaoundé Conseil & Audit
    Tel: 237690 99 88 77
    Email: info@yaounde-audit.cm
    Ville: Yaoundé
    """

    res = await lead_extractor.extract_leads(sample_text)
    assert res.leads_count == 2
    cities = [l.city for l in res.leads]
    assert "Douala" in cities
    assert "Yaoundé" in cities
