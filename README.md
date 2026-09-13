# 🌍 KamStore SaaS Platform

> **Services & Tourisme au Cameroun** — Plateforme SaaS multi-services complète avec IA intégrée, Web Scraping asynchrone, Rotation de Proxies et Passerelles de Paiement Mobile Money.

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Celery](https://img.shields.io/badge/Celery-5.3+-37814A?logo=celery&logoColor=white)](https://docs.celeryq.dev)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Technologies Utilisées (Spécification Conforme)](#-technologies-utilisées)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Architecture Technique](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation Rapide](#-installation-rapide)
- [Lancement](#-lancement)
- [Structure du Projet](#-structure-du-projet)
- [Documentation des API](#-documentation-des-api)
- [Tests & Intégration Continue](#-tests--intégration-continue)
- [Adaptation pour Commit GitHub](#-adaptation-pour-commit-github)

---

## 🎯 À propos

**KamStore** est une plateforme SaaS moderne spécialement adaptée au marché camerounais et d'Afrique centrale. Elle fusionne en un portail unifié :
1. La réservation touristique et d'hébergements de standing (Kribi, Limbe, Douala, Yaoundé, Buea).
2. L'extraction de leads B2B assistée par IA (OpenAI, LangChain, HuggingFace et NLP local).
3. Un pipeline de web scraping robuste avec rotation de proxies et exécution asynchrone Celery.
4. L'encaissement direct en Francs CFA (XAF) via **MTN Mobile Money** et **Orange Money** propulsé par **Notch Pay API** et **Campay API**.

---

## 🛠 Technologies Utilisées

| Couche | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Zustand (State Management), Lucide Icons |
| **Backend API** | Python 3.12, FastAPI, SQLAlchemy 2.0 (Asyncio), Pydantic v2, JWT Auth |
| **Database & Cache** | PostgreSQL 16 (pgvector, pg_trgm), Redis 7 (Caching & Job Queues) |
| **AI / NLP Engine** | OpenAI API (GPT-4o-mini), LangChain, HuggingFace models, Cameroon NLP Regex Engine |
| **Scraping Framework** | Scrapy, Playwright, Puppeteer architecture avec `ProxyRotator` dynamique |
| **Payment Gateway** | **Notch Pay API** & **Campay API** (Supports MTN MoMo & Orange Money Cameroun) |
| **Queue / Automations** | **Celery** & **Redis** pour scraping asynchrone, emails transactionnels et Celery Beat |

---

## ✨ Fonctionnalités Principales

### 🌴 Tourisme & Logement au Cameroun
- Réservation de villas balnéaires à Kribi, appartements meublés à Bonapriso / Bastos.
- Excursions guidées (Chutes de la Lobé, Ascension du Mont Cameroun).
- Calcul automatique des nuits et forfaits en XAF.

### 🤖 Extraction Intelligente de Leads B2B (AI / NLP)
- Analyse de textes, documents ou pages web scrapées.
- Extraction normalisée : Nom de l'entreprise, contact, email, téléphone camerounais validé (+237 MTN / Orange).
- Catégorisation sectorielle et score de confiance (0 à 100%).
- Export des leads en 1 clic au format **CSV** ou **JSON**.

### 🕷️ Web Scraping Asynchrone & Rotation de Proxies
- Choix du moteur : Scrapy, Playwright, Puppeteer ou Async HTTP.
- Gestionnaire de pool de proxies avec stratégie Round Robin et notation de santé.
- Traitement asynchrone en tâche de fond via Celery sans blocage de l'interface.

### 💳 Passerelles de Paiement MTN MoMo & Orange Money
- Intégration certifiée de **Notch Pay API** et **Campay API**.
- Support natif des opérateurs : MTN MoMo (*126#) et Orange Money (#150#).
- Mode Sandbox / Simulateur USSD intégré pour tester sans compte marchand.
- Webhooks signés HMAC-SHA256 avec mise à jour du statut en temps réel.
- Envoi automatique de reçus de paiement par email.

### 💬 Chatbot Assistant Intelligent
- Assistant conversationnel avec connaissance locale approfondie du Cameroun.
- Suggestions interactives de séjours, d'excursions et d'assistance aux paiements.

---

## 🏗 Architecture Technique

Consultez [ARCHITECTURE.md](ARCHITECTURE.md) pour les diagrammes détaillés et les flux de données.

```
kamstore-saas/
├── .github/workflows/ci.yml       # Pipeline CI/CD GitHub Actions
├── backend/                       # API FastAPI Python
│   ├── app/
│   │   ├── ai/                    # Moteur Lead Extraction, Chatbot, Recommender
│   │   ├── api/v1/                # Routes (auth, tourism, housing, payments, scraping, ai)
│   │   ├── core/                  # Config, Database, Celery App, Security
│   │   ├── models/                # Modèles SQLAlchemy (Lead, ScrapingJob, Payment, etc.)
│   │   ├── schemas/               # Schémas Pydantic v2
│   │   ├── services/              # Notch Pay, Campay, Scraper, Email
│   │   └── tasks/                 # Tâches asynchrones Celery
│   ├── migrations/                # Migrations de base Alembic
│   ├── tests/                     # Suite de tests automatisés pytest
│   └── requirements.txt           # Dépendances Python
├── frontend/                      # Application Next.js 14
│   ├── src/
│   │   ├── app/                   # Pages (Tourisme, Leads IA, Scraping, Paiements, Dashboard)
│   │   ├── components/            # Header, ChatWidget, Footer, UI
│   │   └── lib/                   # Zustand stores, API Client
├── scripts/
│   ├── init-db.sql                # Script d'initialisation PostgreSQL
│   └── seed_data.py               # Seeder de données de démonstration
├── docker-compose.yml             # Orchestration des conteneurs
└── .env.example                   # Modèle des variables d'environnement
```

---

## 🚀 Lancement avec Docker Compose

### 1. Cloner et configurer l'environnement

```bash
git clone https://github.com/votre-compte/kamstore-saas.git
cd kamstore-saas
cp .env.example .env
```

### 2. Démarrer tous les services

```bash
docker-compose up -d --build
```

Les conteneurs lancés comprennent :
- `kamstore-db` (PostgreSQL 16 + pgvector)
- `kamstore-redis` (Redis 7)
- `kamstore-backend` (FastAPI sur http://localhost:8000)
- `kamstore-frontend` (Next.js sur http://localhost:3000)
- `kamstore-celery-worker` (Traitement async du scraping et emailing)
- `kamstore-celery-beat` (Tâches périodiques)

### 3. Appliquer les migrations et peupler la base

```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend python scripts/seed_data.py
```

---

## 💻 Développement Local (Sans Docker)

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows :
venv\Scripts\activate
# Linux / macOS :
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Worker Celery :
```bash
celery -A app.core.celery_app worker --loglevel=info
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 📡 Documentation des API

Documentation interactive auto-générée :
- **Swagger UI** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc** : [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Endpoints Clés

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Authentification & délivrance token JWT |
| `POST` | `/api/v1/payments/initialize` | Initier paiement via Notch Pay ou Campay (MoMo) |
| `GET` | `/api/v1/payments/verify/{ref}` | Vérifier le statut d'une transaction |
| `POST` | `/api/v1/payments/webhook/notchpay` | Webhook Notch Pay avec signature HMAC |
| `POST` | `/api/v1/payments/webhook/campay` | Webhook Campay pour débits directs |
| `POST` | `/api/v1/ai/extract-leads` | Extraction de contacts/leads via IA & NLP |
| `POST` | `/api/v1/ai/chatbot/message` | Assistant conversationnel IA |
| `POST` | `/api/v1/scraping/jobs` | Lancer un crawler avec rotation de proxy |
| `GET` | `/api/v1/scraping/proxies` | Voir l'état et la santé du pool de proxies |
| `GET` | `/api/v1/scraping/leads/export` | Exporter les leads extraits au format CSV |

---

## 🧪 Tests & Intégration Continue

Exécuter la suite de tests automatisés :
```bash
cd backend
pytest tests/ -v
```

Tests inclus :
- `test_lead_extractor.py` : Validation des numéros camerounais MTN/Orange, emails et villes.
- `test_scraper.py` : Rotation round-robin et quarantaine des proxies défaillants.
- `test_payments.py` : Signature cryptographique Notch Pay et initialisation Campay.
- `test_auth.py` : Hachage bcrypt et création de tokens JWT conformes.

Le pipeline CI/CD GitHub Actions est configuré dans `.github/workflows/ci.yml`.

---

## 📦 Adaptation pour Commit GitHub

Ce projet est 100% prêt pour être poussé sur GitHub :
- `.gitignore` complet excluant `node_modules`, `venv`, fichiers `.env`, caches et logs.
- `.env.example` documentant toutes les variables sensibles.
- `.github/workflows/ci.yml` pour valider chaque pull request.
- Pas de secrets en clair dans le code source.

Pour effectuer votre premier commit :
```bash
git add .
git commit -m "feat: complete KamStore SaaS platform with Next.js, FastAPI, Celery, AI lead extraction, scraping proxy rotation, and Notch Pay/Campay MoMo"
git branch -M main
git remote add origin https://github.com/votre-compte/kamstore-saas.git
git push -u origin main
```

---

<p align="center">
  Fait avec ❤️ au Cameroun 🇨🇲 — KamStore SaaS Platform
</p>
