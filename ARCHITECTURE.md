# 🏛️ KamStore SaaS - Architecture & Technical Design

Cette documentation détaille l'architecture complète, les flux de données et les protocoles d'intégration de la plateforme **KamStore SaaS**, conformément au cahier des charges technique.

---

## 1. Matrice Technologique

| Couche | Technologies Recommandées | Rôle dans KamStore |
|---|---|---|
| **Frontend** | Next.js (React), Tailwind CSS, Zustand | Interface web réactive, App Router, gestion d'état Zustand (`useLeadStore`, `useScraperStore`, `usePaymentStore`, `useTourismStore`). |
| **Backend API** | Python (FastAPI), SQLAlchemy 2.0 Asyncio | API REST asynchrone haute performance, Pydantic v2, authentification JWT, modularité v1. |
| **Database & Cache** | PostgreSQL 16 (pgvector, pg_trgm), Redis 7 | Données relationnelles (utilisateurs, réservations, annonces, paiements, leads), cache et broker Celery. |
| **AI / NLP Engine** | OpenAI API, LangChain, HuggingFace, Cameroon NLP | Extraction structurée de leads (entreprises, numéros +237 MTN/Orange validés, emails, villes, scoring de confiance). |
| **Scraping Framework** | Scrapy, Playwright, Puppeteer, Async HTTP | Crawlers multi-moteurs avec gestion de rotation de proxies (`ProxyRotator`), contournement anti-bot et user-agents aléatoires. |
| **Payment Gateway** | Notch Pay API & Campay API | Paiements instantanés MTN Mobile Money & Orange Money Cameroun (XAF), webhooks signés HMAC-SHA256, simulateur sandbox. |
| **Queue & Automations** | Celery & Redis | Exécution asynchrone des scrapers, envoi d'emails transactionnels (reçus, réservations) et tâches planifiées (Celery Beat). |

---

## 2. Diagramme d'Architecture

```
                      ┌─────────────────────────────────┐
                      │    Navigateur Utilisateur       │
                      │  Next.js 14 + Tailwind CSS      │
                      │  Zustand (Store client)         │
                      └────────────────┬────────────────┘
                                       │ HTTPS / JSON
                                       ▼
                      ┌─────────────────────────────────┐
                      │      API Gateway (FastAPI)      │
                      │  JWT Auth • Pydantic • OpenAPI  │
                      └───────┬───────────────┬─────────┘
                              │               │
            ┌─────────────────┴─┐           ┌─┴─────────────────┐
            ▼                   ▼           ▼                   ▼
    ┌──────────────┐    ┌─────────────┐ ┌───────────────┐ ┌──────────────┐
    │  PostgreSQL  │    │   Redis 7   │ │  Paiements    │ │  Moteur IA   │
    │  + pgvector  │    │  (Broker)   │ │  Notch Pay &  │ │  OpenAI /    │
    │  Relational  │    │  & Cache    │ │  Campay MoMo  │ │  LangChain / │
    └──────────────┘    └──────┬──────┘ └───────────────┘ │  Local NLP   │
                               │                          └──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    Celery Worker    │
                    ├─────────────────────┤
                    │ • Scraper Engine    │ ──▶ [Proxy Rotation Pool]
                    │ • Email Transac.    │ ──▶ [SMTP Server]
                    │ • Beat Scheduler    │
                    └─────────────────────┘
```

---

## 3. Détail des Flux Principaux

### 3.1. Extraction de Leads par IA (AI / NLP Engine)
1. **Entrée** : Texte brut, annuaire en ligne, ou HTML scrapé.
2. **Traitement** :
   - Si clé OpenAI configurée : GPT-4o-mini avec JSON Mode pour extraction sémantique structurée.
   - Si HuggingFace configuré : NER BERT pour détection d'entités nommées.
   - En local ou fallback : Parseur NLP dédié Cameroun avec expressions régulières adaptées aux opérateurs camerounais (+237 67x, 68x, 65x pour MTN et +237 69x, 655-659 pour Orange).
3. **Sortie** : Objet `Lead` contenant nom de l'entreprise, contact, téléphone validé, email, ville (Douala, Yaoundé, Kribi, etc.), catégorie commerciale, résumé IA et score de confiance (0.00 à 1.00).

### 3.2. Web Scraping & Rotation de Proxies
1. L'utilisateur configure une URL cible et un mot-clé via le hub de scraping.
2. Une tâche Celery asynchrone `run_async_scraping_job` est soumise au broker Redis.
3. Le `ProxyRotator` assigne une adresse IP saine parmi le pool (datacenters ou résidentiels).
4. Le moteur (Playwright, Scrapy ou Async HTTP) exécute la requête avec user-agents rotatifs.
5. En cas de succès, le health score du proxy augmente (+5) ; en cas de blocage HTTP 429 / captcha, le proxy est mis en quarantaine (-20) et la requête bascule sur un nouveau nœud.
6. Le contenu nettoyé est automatiquement transmis à l'`AILeadExtractor` pour peupler la table `leads`.

### 3.3. Passerelles de Paiement MTN MoMo & Orange Money
1. L'utilisateur initie une réservation ou un achat (en devise XAF).
2. L'API FastAPI génère une référence unique `KAM-XXXXXXXXXXXX` et appelle soit :
   - **Notch Pay API** (`/payments/initialize`) : Fournit une URL de paiement ou gère le canal direct mobile money.
   - **Campay API** (`/collect/`) : Déclenche une demande de débit USSD immédiate sur le terminal téléphonique du client (*126# ou #150#).
3. Le serveur distant envoie un webhook asynchrone à `/api/v1/payments/webhook/notchpay` ou `/api/v1/payments/webhook/campay`.
4. La signature cryptographique HMAC-SHA256 est vérifiée.
5. Dès que le statut passe à `completed`, une tâche Celery `send_async_email_receipt` envoie automatiquement le reçu électronique au client.

---

## 4. Mode Développeur & Simulation Sandbox
Pour faciliter les tests locaux sans nécessiter d'abonnements ou d'identifiants marchands réels :
- **Paiements** : Mode sandbox automatique permettant de tester la confirmation USSD et la validation instantanée.
- **Scraping** : Simulation intelligente pour les URLs d'exemples avec retour de données typiques camerounaises.
- **IA Lead Extraction** : Parseur NLP local performant ne nécessitant aucune connexion API tierce.
