import { create } from 'zustand';
import { api } from './api';

export interface Lead {
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  category?: string;
  address?: string;
  city: string;
  country: string;
  confidence_score: number;
  ai_summary?: string;
  sentiment?: string;
}

export interface ScrapingJob {
  id: string;
  target_url: string;
  keyword?: string;
  engine: string;
  proxy_rotation_enabled: boolean;
  proxy_used?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  leads_extracted: number;
  created_at: string;
  completed_at?: string;
}

export interface PaymentRecord {
  id: string;
  transaction_ref: string;
  provider: 'notch_pay' | 'campay' | 'mtn_momo' | 'orange_money';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  customer_phone?: string;
  checkout_url?: string;
  created_at: string;
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  category: 'hotel' | 'restaurant' | 'activity' | 'housing';
  type: 'tourism' | 'housing';
  price: number;
  city: string;
  image: string;
  rating: number;
}

// ----------------------------------------------------
// Lead Extraction Store
// ----------------------------------------------------
interface LeadStoreState {
  leads: Lead[];
  isLoading: boolean;
  engineUsed: string;
  processingTimeMs: number;
  extractLeads: (text: string, categoryHint?: string, engine?: string) => Promise<void>;
  addLead: (lead: Lead) => void;
  clearLeads: () => void;
}

export const useLeadStore = create<LeadStoreState>((set) => ({
  leads: [
    {
      company_name: "Hôtel Kribi Palace & Résidences",
      contact_person: "Jean-Paul Mvondo",
      email: "contact@kribipalace.cm",
      phone: "+237 677 12 34 56",
      category: "Hôtellerie & Hébergement",
      address: "Boulevard de la Plage",
      city: "Kribi",
      country: "Cameroun",
      confidence_score: 0.95,
      ai_summary: "Complexe hôtelier 4 étoiles face à la mer avec suites climatisées.",
      sentiment: "positive"
    },
    {
      company_name: "Douala Express Logistics & Transport",
      contact_person: "Chantal Bella",
      email: "booking@douala-express.cm",
      phone: "+237 650 11 22 33",
      category: "Transport & Logistique",
      address: "Rue Joss, Bonanjo",
      city: "Douala",
      country: "Cameroun",
      confidence_score: 0.92,
      ai_summary: "Transport VIP, navettes aéroport et déménagements sécurisés.",
      sentiment: "positive"
    },
    {
      company_name: "Bastos Eco-Appartements",
      contact_person: "Mme Manga",
      email: "info@bastos-apartments.cm",
      phone: "+237 699 88 77 66",
      category: "Immobilier & Logement",
      address: "Quartier Bastos",
      city: "Yaoundé",
      country: "Cameroun",
      confidence_score: 0.94,
      ai_summary: "Résidences meublées sécurisées avec piscine et groupe électrogène.",
      sentiment: "neutral"
    }
  ],
  isLoading: false,
  engineUsed: "local_nlp",
  processingTimeMs: 45.2,

  extractLeads: async (text: string, categoryHint?: string, engine: string = "auto") => {
    set({ isLoading: true });
    try {
      const res = await api.post('/ai/extract-leads', {
        text,
        category_hint: categoryHint,
        use_ai_model: engine
      });
      const data = res.data;
      set({
        leads: data.leads,
        engineUsed: data.engine_used,
        processingTimeMs: data.processing_time_ms,
        isLoading: false
      });
    } catch (e) {
      // Fallback simulation if backend offline
      setTimeout(() => {
        const dummyLead: Lead = {
          company_name: "Entreprise Extraite (Simulée)",
          contact_person: "M. Nguemo",
          email: "contact@entreprise-cm.com",
          phone: "+237 675 00 11 22",
          category: categoryHint || "Commerce & Services",
          address: "Akwa Centre commercial",
          city: "Douala",
          country: "Cameroun",
          confidence_score: 0.91,
          ai_summary: "Contact extrait automatiquement depuis le texte fourni.",
          sentiment: "positive"
        };
        set((state) => ({
          leads: [dummyLead, ...state.leads],
          isLoading: false,
          engineUsed: engine === "auto" ? "cameroon-nlp" : engine,
          processingTimeMs: 58.0
        }));
      }, 600);
    }
  },

  addLead: (lead: Lead) => set((state) => ({ leads: [lead, ...state.leads] })),
  clearLeads: () => set({ leads: [] })
}));

// ----------------------------------------------------
// Scraping & Proxy Store
// ----------------------------------------------------
interface ScraperStoreState {
  jobs: ScrapingJob[];
  activeProxiesCount: number;
  rotationStrategy: string;
  isLoading: boolean;
  fetchJobs: () => Promise<void>;
  createJob: (targetUrl: string, keyword?: string, engine?: string, rotateProxy?: boolean) => Promise<void>;
}

export const useScraperStore = create<ScraperStoreState>((set) => ({
  jobs: [
    {
      id: "job-101",
      target_url: "https://pagesjaunescameroun.com/hotels-kribi",
      keyword: "Tourisme & Hôtels",
      engine: "playwright",
      proxy_rotation_enabled: true,
      proxy_used: "http://198.51.100.1:8080",
      status: "completed",
      leads_extracted: 12,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      completed_at: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: "job-102",
      target_url: "https://douala-immobilier.cm/agences",
      keyword: "Immobilier",
      engine: "scrapy",
      proxy_rotation_enabled: true,
      proxy_used: "http://203.0.113.10:3128",
      status: "completed",
      leads_extracted: 8,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      completed_at: new Date(Date.now() - 7100000).toISOString()
    }
  ],
  activeProxiesCount: 4,
  rotationStrategy: "round_robin",
  isLoading: false,

  fetchJobs: async () => {
    try {
      const res = await api.get('/scraping/jobs');
      set({ jobs: res.data });
    } catch {
      // Keep initial demo state
    }
  },

  createJob: async (targetUrl: string, keyword?: string, engine: string = "playwright", rotateProxy: boolean = true) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/scraping/jobs', {
        target_url: targetUrl,
        keyword,
        engine,
        enable_proxy_rotation: rotateProxy
      });
      set((state) => ({ jobs: [res.data, ...state.jobs], isLoading: false }));
    } catch {
      // Offline simulation
      const newJob: ScrapingJob = {
        id: `job-${Math.floor(Math.random() * 900 + 100)}`,
        target_url: targetUrl,
        keyword,
        engine,
        proxy_rotation_enabled: rotateProxy,
        proxy_used: rotateProxy ? "http://198.51.100.2:8080" : undefined,
        status: "completed",
        leads_extracted: 6,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
      set((state) => ({ jobs: [newJob, ...state.jobs], isLoading: false }));
    }
  }
}));

// ----------------------------------------------------
// Payment Store (Notch Pay & Campay)
// ----------------------------------------------------
interface PaymentStoreState {
  payments: PaymentRecord[];
  isProcessing: boolean;
  lastPaymentUrl: string | null;
  initiatePayment: (amount: number, provider: 'notch_pay' | 'campay', phone: string, email?: string) => Promise<PaymentRecord>;
  verifyPayment: (reference: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentStoreState>((set) => ({
  payments: [
    {
      id: "pay-1",
      transaction_ref: "KAM-A1B2C3D4",
      provider: "notch_pay",
      amount: 45000,
      currency: "XAF",
      status: "completed",
      customer_phone: "+237699001122",
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "pay-2",
      transaction_ref: "KAM-E5F6G7H8",
      provider: "campay",
      amount: 25000,
      currency: "XAF",
      status: "completed",
      customer_phone: "+237677443322",
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  isProcessing: false,
  lastPaymentUrl: null,

  initiatePayment: async (amount: number, provider: 'notch_pay' | 'campay', phone: string, email?: string) => {
    set({ isProcessing: true });
    try {
      const res = await api.post('/payments/initialize', {
        amount,
        currency: "XAF",
        provider,
        customer_phone: phone,
        customer_email: email,
        description: `Paiement KamStore (${provider === 'notch_pay' ? 'Notch Pay' : 'Campay MoMo'})`
      });
      const paymentData = res.data;
      set((state) => ({
        payments: [paymentData, ...state.payments],
        isProcessing: false,
        lastPaymentUrl: paymentData.checkout_url
      }));
      return paymentData;
    } catch {
      // Simulation fallback
      const simulated: PaymentRecord = {
        id: `pay-${Date.now()}`,
        transaction_ref: `KAM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        provider,
        amount,
        currency: "XAF",
        status: "processing",
        customer_phone: phone,
        checkout_url: provider === 'notch_pay' 
          ? `https://pay.notchpay.co/checkout/NP-SIM-${Date.now()}` 
          : `https://demo.campay.net/pay/CAMPAY-SIM-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      set((state) => ({
        payments: [simulated, ...state.payments],
        isProcessing: false,
        lastPaymentUrl: simulated.checkout_url
      }));
      return simulated;
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const res = await api.get(`/payments/verify/${reference}`);
      const isSuccess = res.data.status === 'completed';
      set((state) => ({
        payments: state.payments.map((p) => p.transaction_ref === reference ? { ...p, status: 'completed' } : p)
      }));
      return isSuccess;
    } catch {
      set((state) => ({
        payments: state.payments.map((p) => p.transaction_ref === reference ? { ...p, status: 'completed' } : p)
      }));
      return true;
    }
  }
}));

// ----------------------------------------------------
// Tourism & Housing Store
// ----------------------------------------------------
interface TourismStoreState {
  listings: ListingItem[];
  filterCategory: string;
  filterCity: string;
  setCategory: (c: string) => void;
  setCity: (c: string) => void;
}

export const useTourismStore = create<TourismStoreState>((set) => ({
  listings: [
    {
      id: "list-1",
      title: "Villa Balnéaire Vue sur Mer - Kribi",
      description: "Superbe villa privée avec accès direct à la plage de sable blanc. 3 chambres climatisées, cuisinier privé et vue sur l'océan Atlantique.",
      category: "hotel",
      type: "housing",
      price: 45000,
      city: "Kribi",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      rating: 4.9
    },
    {
      id: "list-2",
      title: "Appartement Meublé Standing - Bonapriso Douala",
      description: "Appartement moderne au cœur du quartier résidentiel Bonapriso. Fibre optique, sécurité H24, groupe électrogène automatique.",
      category: "housing",
      type: "housing",
      price: 35000,
      city: "Douala",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      rating: 4.8
    },
    {
      id: "list-3",
      title: "Excursion Guidée Chutes de la Lobé & Balade Pirogue",
      description: "Visite guidée des célèbres chutes de la Lobé, dégustation de crevettes braisées fraîches et rencontre avec les communautés locales.",
      category: "activity",
      type: "tourism",
      price: 25000,
      city: "Kribi",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 5.0
    },
    {
      id: "list-4",
      title: "Ascension Guidée du Mont Cameroun (4095 m)",
      description: "Randonnée sportive du Char des Dieux à Buea. Guide assermenté, matériel de bivouac et ravitaillement complet inclus.",
      category: "activity",
      type: "tourism",
      price: 60000,
      city: "Buea",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      rating: 4.9
    },
    {
      id: "list-5",
      title: "Studio Meublé Cosy - Bastos Yaoundé",
      description: "Studio calme et sécurisé à 5 minutes des ambassades. Climatisation, cuisine équipée, smart TV avec Netflix et Wi-Fi.",
      category: "housing",
      type: "housing",
      price: 28000,
      city: "Yaoundé",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      rating: 4.7
    },
    {
      id: "list-6",
      title: "Visite Historique & Plage Volcanique - Limbe",
      description: "Découvrez les plages de sable noir de Limbe, le zoo botanique et dégustez les meilleurs poissons braisés au bord de l'eau.",
      category: "activity",
      type: "tourism",
      price: 20000,
      city: "Limbe",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      rating: 4.8
    }
  ],
  filterCategory: "all",
  filterCity: "all",
  setCategory: (c: string) => set({ filterCategory: c }),
  setCity: (c: string) => set({ filterCity: c })
}));
