# 🌍 KamStore SaaS Platform

> **Services & Tourisme au Cameroun** — Plateforme SaaS multi-services avec IA intégrée

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Technologies](#-technologies)

---

## 🎯 À propos

**KamStore** est une plateforme SaaS conçue pour l'Afrique, avec un focus sur le Cameroun. Elle offre des services de localisation, géolocalisation, tourisme et logement, le tout assisté par une intelligence artificielle adaptative.

## ✨ Fonctionnalités

### Services principaux
- 📍 **Localisation de téléphone** — Identifiez l'emplacement d'un numéro de téléphone
- 🌍 **Géolocalisation d'appareils** — Suivez vos appareils connectés en temps réel
- ✈️ **Tourisme Cameroun** — Explorez et réservez des activités touristiques avec un booking system adapté à l'Afrique
- 🏠 **Services de logement** — Trouvez et réservez des logements

### Intelligence Artificielle
- 🤖 **Chatbot IA** — Assistant conversationnel intelligent pour l'aide aux utilisateurs
- 🧠 **Matching IA** — Recommandations personnalisées basées sur les préférences utilisateur
- 🔒 **Sécurité IA** — Système de sécurité adaptatif pour la base de données

### Paiements
- 💳 **MTN Mobile Money** — Paiement via Mobile Money (Cameroun)
- 🍊 **Orange Money** — Paiement via Orange Money
- Devise par défaut : **XAF (Franc CFA)**

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              Next.js 14 + Tailwind              │
├─────────────────────────────────────────────────┤
│                  API Gateway                     │
│             FastAPI + JWT Auth                   │
├──────────┬──────────┬──────────┬────────────────┤
│ Localisa │ Géoloca  │ Tourism  │ Logement       │
│   tion   │  tion    │ & Book.  │ Service        │
├──────────┴──────────┴──────────┴────────────────┤
│              Services IA                         │
│  Matching │ Chatbot │ Scraper │ Sécurité       │
├─────────────────────────────────────────────────┤
│              Base de Données                     │
│     PostgreSQL 16 + pgvector │ Redis            │
└─────────────────────────────────────────────────┘
```

---

## 📦 Prérequis

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

Pour le développement local sans Docker :
- [Python 3.12+](https://python.org)
- [Node.js 20+](https://nodejs.org)
- [PostgreSQL 16](https://www.postgresql.org)
- [Redis 7](https://redis.io)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/your-username/kamstore-saas.git
cd kamstore-saas
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditez .env avec vos valeurs
```

### 3. Lancer avec Docker Compose

```bash
docker-compose up -d --build
```

### 4. Appliquer les migrations

```bash
docker-compose exec backend alembic upgrade head
```

---

## 🎮 Lancement

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Application web |
| **Backend API** | http://localhost:8000 | API REST |
| **API Docs** | http://localhost:8000/docs | Documentation Swagger |
| **API ReDoc** | http://localhost:8000/redoc | Documentation ReDoc |

### Développement local (sans Docker)

**Backend :**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Structure du projet

```
kamstore-saas/
├── backend/                  # API FastAPI (Python)
│   ├── app/
│   │   ├── api/v1/          # Routes API versionnées
│   │   ├── core/            # Config, DB, Security
│   │   ├── models/          # Modèles SQLAlchemy
│   │   ├── schemas/         # Schémas Pydantic
│   │   ├── services/        # Logique métier
│   │   ├── ai/              # Services IA
│   │   └── utils/           # Utilitaires
│   ├── migrations/          # Alembic
│   └── tests/               # Tests pytest
├── frontend/                 # App Next.js (TypeScript)
│   └── src/
│       ├── app/             # Pages (App Router)
│       ├── components/      # Composants React
│       ├── lib/             # Utilitaires
│       └── types/           # Types TypeScript
├── scripts/                  # Scripts utilitaires
├── docker-compose.yml        # Orchestration Docker
└── .env.example              # Template variables
```

---

## 📡 API Documentation

L'API est auto-documentée grâce à FastAPI. Accédez à :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

### Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Inscription |
| `POST` | `/api/v1/auth/login` | Connexion |
| `GET` | `/api/v1/auth/me` | Profil courant |
| `GET` | `/api/v1/users` | Liste des utilisateurs (admin) |
| `GET` | `/api/v1/listings` | Annonces tourisme/logement |
| `POST` | `/api/v1/bookings` | Créer une réservation |
| `POST` | `/api/v1/payments` | Initier un paiement |
| `POST` | `/api/v1/chatbot/message` | Envoyer un message au chatbot |

---

## 🛠 Technologies

| Composant | Technologie |
|-----------|------------|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Base de données | PostgreSQL 16 + pgvector |
| Cache | Redis 7 |
| IA | Gemini API, LangChain |
| Paiements | MTN MoMo API, Orange Money API |
| Cartes | Leaflet + OpenStreetMap |
| Conteneurs | Docker, Docker Compose |
| Tests | pytest, Jest |

---

## 📄 Licence

Ce projet est privé et propriétaire. Tous droits réservés.

---

<p align="center">
  Made with ❤️ in Cameroun 🇨🇲
</p>
