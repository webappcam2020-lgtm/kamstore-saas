"""
KamStore SaaS - Database Seeder Script
Populates demo listings (Tourism & Housing in Cameroon), sample leads, and admin/user accounts.
Run with: python scripts/seed_data.py
"""

import asyncio
import uuid
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.listing import Listing, ListingCategory, ListingType, ListingImage
from app.models.lead import Lead
from app.core.security import get_password_hash

async def seed():
    print("🌱 Starting database seeding for KamStore...")
    
    async with AsyncSessionLocal() as session:
        # Create Demo Admin
        admin = User(
            id=uuid.uuid4(),
            email="admin@kamstore.cm",
            password_hash=get_password_hash("admin123456"),
            full_name="Admin KamStore",
            phone="+237699000001",
            role=UserRole.admin,
            is_active=True,
            is_verified=True
        )
        session.add(admin)

        # Create Demo Host
        host = User(
            id=uuid.uuid4(),
            email="host@kamstore.cm",
            password_hash=get_password_hash("host123456"),
            full_name="Jean-Paul Host",
            phone="+237677000002",
            role=UserRole.host,
            is_active=True,
            is_verified=True
        )
        session.add(host)

        # Demo Listings
        listings_data = [
            {
                "title": "Villa Balnéaire Vue sur Mer - Kribi",
                "description": "Superbe villa privée avec accès direct à la plage de Kribi. 3 chambres climatisées, groupe électrogène, cuisinier privé et vue imprenable sur le golfe de Guinée.",
                "category": ListingCategory.hotel,
                "type": ListingType.housing,
                "price": 45000.0,
                "city": "Kribi",
                "address": "Plage de Ngoye",
                "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
            },
            {
                "title": "Appartement Meublé Haut Standing - Bonapriso Douala",
                "description": "Appartement moderne 2 chambres au cœur de Bonapriso. Wi-Fi haut débit fibre optique, sécurité 24h/24, parking gardé et proximité aéroport international.",
                "category": ListingCategory.housing,
                "type": ListingType.housing,
                "price": 35000.0,
                "city": "Douala",
                "address": "Rue Njo-Njo, Bonapriso",
                "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            },
            {
                "title": "Excursion Guidée aux Chutes de la Lobé & Pygmées",
                "description": "Découvrez le spectacle unique des chutes se jetant dans l'océan Atlantique. Visite guidée en pirogue traditionnelle, dégustation de crevettes fraîches et rencontre culturelle.",
                "category": ListingCategory.activity,
                "type": ListingType.tourism,
                "price": 25000.0,
                "city": "Kribi",
                "address": "Chutes de la Lobé",
                "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            },
            {
                "title": "Ascension Guidée du Mont Cameroun (Char des Dieux)",
                "description": "Randonnée sportive inoubliable sur le point culminant d'Afrique de l'Ouest (4095 m). Guides certifiés, porteurs, équipement de campement et ravitaillement inclus.",
                "category": ListingCategory.activity,
                "type": ListingType.tourism,
                "price": 60000.0,
                "city": "Buea",
                "address": "Route du Mont Cameroun, Buea",
                "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            }
        ]

        for l_data in listings_data:
            listing = Listing(
                id=uuid.uuid4(),
                owner_id=host.id,
                title=l_data["title"],
                description=l_data["description"],
                category=l_data["category"],
                type=l_data["type"],
                price_per_night=l_data["price"],
                currency="XAF",
                city=l_data["city"],
                address=l_data["address"],
                country="Cameroun",
                is_active=True
            )
            session.add(listing)

            # Add image
            img = ListingImage(
                id=uuid.uuid4(),
                listing_id=listing.id,
                image_url=l_data["image"],
                is_primary=True
            )
            session.add(img)

        # Demo Leads
        leads_data = [
            {
                "company_name": "Douala Luxury Car Rental",
                "contact_person": "Samuel Eto'o Fils",
                "email": "contact@douala-luxurycars.cm",
                "phone": "+237699112233",
                "category": "Transport & Logistique",
                "city": "Douala",
                "address": "Boulevard de la Liberté, Akwa",
                "confidence_score": 0.96,
                "ai_summary": "Location de véhicules 4x4 et berlines haut de gamme avec chauffeur."
            },
            {
                "company_name": "Kribi Ocean Eco-Resort",
                "contact_person": "Martine Bella",
                "email": "info@kribi-ecoresort.cm",
                "phone": "+237677445566",
                "category": "Hôtellerie & Hébergement",
                "city": "Kribi",
                "address": "Plage de Grand Batanga",
                "confidence_score": 0.94,
                "ai_summary": "Bungalows écologiques en bordure d'océan avec restaurant de fruits de mer."
            },
            {
                "company_name": "Yaoundé Tech Hub & Coworking",
                "contact_person": "Marc Atangana",
                "email": "cowork@yaounde-tech.cm",
                "phone": "+237650889900",
                "category": "Services & Technologies",
                "city": "Yaoundé",
                "address": "Montée Bastos",
                "confidence_score": 0.92,
                "ai_summary": "Espace de travail partagé, salles de réunion et incubateur de startups."
            }
        ]

        for lead_item in leads_data:
            lead = Lead(
                id=uuid.uuid4(),
                user_id=admin.id,
                company_name=lead_item["company_name"],
                contact_person=lead_item["contact_person"],
                email=lead_item["email"],
                phone=lead_item["phone"],
                category=lead_item["category"],
                city=lead_item["city"],
                address=lead_item["address"],
                country="Cameroun",
                confidence_score=lead_item["confidence_score"],
                ai_summary=lead_item["ai_summary"],
                sentiment="positive"
            )
            session.add(lead)

        await session.commit()
        print("✅ Database seeding complete! Admin: admin@kamstore.cm / admin123456")

if __name__ == "__main__":
    asyncio.run(seed())
