'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      text: "Bonjour ! 🇨🇲 Je suis KamBot IA, votre assistant intelligent. Comment puis-je vous aider aujourd'hui sur le tourisme, l'hébergement, l'extraction de leads ou les paiements Mobile Money ?",
      isBot: true
    }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Hôtels à Kribi",
    "Extraire des leads IA",
    "Payer avec MTN MoMo",
    "Rotation de proxies"
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: `user-${Date.now()}`, text: textToSend, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chatbot/message', {
        message: textToSend,
        context_type: 'general'
      });
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, text: data.reply, isBot: true }
      ]);
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch {
      // Fallback local Cameroon responses
      setTimeout(() => {
        let reply = "Je peux vous orienter vers nos logements à Kribi et Douala, nos outils d'extraction de leads ou nos paiements Notch Pay et Campay.";
        const lower = textToSend.toLowerCase();
        if (lower.includes('kribi') || lower.includes('hotel') || lower.includes('tourisme')) {
          reply = "🌴 À Kribi, ne manquez pas les Chutes de la Lobé et nos villas balnéaires privées. Vous pouvez réserver directement avec MTN MoMo ou Orange Money !";
        } else if (lower.includes('lead') || lower.includes('extraction')) {
          reply = "🤖 Notre studio IA extrait automatiquement les numéros camerounais (+237), les emails et les entreprises avec un score de confiance.";
        } else if (lower.includes('momo') || lower.includes('orange') || lower.includes('paiement')) {
          reply = "💳 Nous supportons Notch Pay API et Campay API pour des débits directs MTN Mobile Money (*126#) et Orange Money (#150#).";
        }

        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, text: reply, isBot: true }
        ]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-3.5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-full shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all z-50 flex items-center gap-2 group ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        title="Discuter avec l'assistant IA"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
          Assistant IA
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300 z-50 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-3.5 flex justify-between items-center text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">KamBot IA</span>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En ligne 🇨🇲
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                  msg.isBot
                    ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    : 'bg-emerald-600 text-white rounded-tr-none font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {suggestions.length > 0 && (
          <div className="p-2 bg-gray-100/80 border-t border-gray-200 flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(s)}
                className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded-lg text-[10px] font-semibold border border-gray-200 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez une question..."
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
