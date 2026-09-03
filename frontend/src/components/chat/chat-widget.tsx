"use client";
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour! Je suis KamBot, votre assistant IA. Comment puis-je vous aider aujourd'hui?", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: message, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Ceci est une réponse automatique de KamBot. L'intégration IA complète sera disponible dans la Phase 3.", 
        isBot: true 
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-lg shadow-2xl overflow-hidden transition-all duration-300 z-50 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Header */}
        <div className="bg-primary-600 px-4 py-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="font-semibold">KamBot IA</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-bg">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.isBot 
                  ? 'bg-white text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-tl-none' 
                  : 'bg-primary-600 text-white rounded-tr-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg rounded-tl-none px-4 py-3">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez un message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-dark-bg dark:border-gray-600 dark:text-white"
            />
            <Button type="submit" size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
