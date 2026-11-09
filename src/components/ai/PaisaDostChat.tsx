'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User as UserIcon,
  PlusCircle,
  Clock,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { AIMessage, AIConversation } from '@/types';

export const PaisaDostChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();

  const quickPrompts = [
    'How do I use my 100,000 TROIX?',
    'Explain PSX & KSE-100 basics',
    'Mehangai se bachne ka tareeqa kya hai?',
    'What stocks should a beginner buy?',
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (activeConvId && user) {
      loadMessages(activeConvId);
    }
  }, [activeConvId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res: any = await api.get('/ai/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !activeConvId) {
        setActiveConvId(res.data[0]._id);
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res: any = await api.get(`/ai/conversations/${convId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.warn('Failed to load messages:', err);
    }
  };

  const handleStartNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setHistoryOpen(false);
  };

  const handleSend = async (contentToSend?: string) => {
    const text = contentToSend || inputValue;
    if (!text || text.trim() === '' || isSending) return;

    const userMsg: AIMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const res: any = await api.post('/ai/chat', {
        message: text,
        conversationId: activeConvId,
      });

      const { assistantMessage, conversationId } = res.data;
      if (conversationId && conversationId !== 'guest-session') {
        setActiveConvId(conversationId);
      }

      setMessages((prev) => [...prev, assistantMessage]);

      if (user) {
        loadConversations();
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered a temporary connection issue. Please feel free to ask your question again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Global Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Paisa Dost Financial Assistant"
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-forest-800 hover:bg-forest-700 text-white shadow-lg border border-emerald-500/40 flex items-center gap-2.5 cursor-pointer transition-all"
      >
        <Bot className="w-5 h-5 text-emerald-400" />
        <span className="font-serif font-bold text-sm tracking-wide">Paisa Dost</span>
      </button>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 md:w-[440px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-forest-900 text-white flex items-center justify-between border-b border-emerald-900/40 select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm tracking-wide">Paisa Dost</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-semibold tracking-wider">
                      ASSISTANT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">English • Urdu • Roman Urdu</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {user && (
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    title="Past Consultations"
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-forest-800 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}
                {user && (
                  <button
                    onClick={handleStartNewConversation}
                    title="New Consultation"
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-forest-800 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-forest-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation History Drawer */}
            {historyOpen && user && (
              <div className="bg-forest-950 text-white p-3 border-b border-emerald-900/40 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-900/30 text-xs font-semibold text-emerald-400">
                  <span>Saved Consultations</span>
                  <button onClick={handleStartNewConversation} className="text-[11px] text-emerald-300 hover:underline">
                    + New
                  </button>
                </div>
                {conversations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No previous conversations yet.</p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => {
                          setActiveConvId(c._id);
                          setHistoryOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                          activeConvId === c._id ? 'bg-emerald-600 text-white' : 'hover:bg-forest-800 text-slate-300'
                        }`}
                      >
                        {c.title || 'Conversation'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-surface-light">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200">
                    <HelpCircle className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-serif font-bold text-forest-900 text-base mb-1">Financial Assistant</h4>
                  <p className="text-slate-500 text-xs max-w-xs mb-4 leading-relaxed">
                    Ask questions about the Pakistan Stock Exchange, TROIX virtual trading, inflation protection, and portfolio diversification.
                  </p>

                  {/* Quick Prompts */}
                  <div className="w-full space-y-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-medium border border-slate-200 hover:border-emerald-300 transition-all flex items-center gap-2.5 shadow-2xs"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-forest-800 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-2xs ${
                          isUser
                            ? 'bg-forest-800 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isSending && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-forest-800 text-emerald-300 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask about stocks, TROIX, inflation..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isSending}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-forest-800 hover:bg-forest-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaisaDostChat;
