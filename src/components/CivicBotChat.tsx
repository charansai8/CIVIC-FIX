import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  HelpCircle,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface CivicBotChatProps {
  currentLang: SupportedLanguage;
  isDark: boolean;
  onOpenReportModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const CivicBotChat: React.FC<CivicBotChatProps> = ({
  currentLang,
  isDark,
  onOpenReportModal,
  onSelectTab,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting in chosen language
  useEffect(() => {
    const greetingText = {
      te: 'నమస్కారం! నేను మీ సివిక్‌ఫిక్స్ AI సహాయకుడిని. రోడ్డు గుంతలు, వీధి దీపాలు, చెత్త లేదా తాగునీటి సమస్యలను ఎలా నివేదించాలో లేదా మీ ఫిర్యాదు స్థితిని ఎలా తనిఖీ చేయాలో నన్ను అడగండి.',
      en: "Hello! I am your CivicFix AI Assistant. Ask me how to report potholes, streetlights, sanitation, or how to track your complaint's progress.",
      hi: 'नमस्ते! मैं आपका सिविकफिक्स AI सहायक हूँ। सड़क, स्ट्रीट लाइट, कचरा या जल आपूर्ति की समस्या दर्ज करने के बारे में कुछ भी पूछें।',
      mr: 'नमस्कार! मी तुमचा सिव्हिकफिक्स AI सहाय्यक आहे. नागरी समस्यांची तक्रार कशी करावी किंवा स्थिती कशी तपासावी याविषयी विचारा.',
      ta: 'வணக்கம்! நான் உங்கள் சிவிக்பிக்ஸ் AI உதவியாளர். சாலை பள்ளங்கள், தெருவிளக்கு அல்லது குடிநீர் பிரச்சனைகளை எவ்வாறு பதிவு செய்வது என்று கேளுங்கள்.',
      bn: 'নমস্কার! আমি আপনার সিভিকফিক্স AI সহকারী। নাগরিক সমস্যা দায়ের বা ট্র্যাক করার বিষয়ে যেকোনো প্রশ্ন করুন।',
    }[currentLang];

    setMessages([
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentLang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Call server AI proxy or run local civic assistant response
    try {
      let botResponse = '';
      const apiKey = (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY;

      // Smart civic rule engine & multilingual fallback
      const q = query.toLowerCase();
      if (q.includes('pothole') || q.includes('రోడ్డు') || q.includes('గుంత') || q.includes('सड़क') || q.includes('गड्ढा')) {
        botResponse = {
          te: 'రోడ్డు గుంతలను నివేదించడానికి:\n1. పైనున్న "+ సమస్యను నివేదించండి" బటన్ క్లిక్ చేయండి.\n2. "రోడ్లు మరియు గుంతలు" విభాగం ఎంచుకోండి.\n3. ఫోటో సాక్ష్యం అప్‌లోడ్ చేయండి లేదా సిమ్యులేటెడ్ ఫోటో ఎంచుకోండి.\n4. వీధి పేరు, ల్యాండ్‌మార్క్ నమోదు చేయండి.\nఫిర్యాదు దాఖలు చేయగానే 24-48 గంటల్లో రోడ్ల నిర్వహణ బృందం చేరుకుంటుంది.',
          en: 'To report a pothole:\n1. Click "+ Report an Issue" on the navbar.\n2. Select "Roads & Potholes" category.\n3. Upload photo evidence of the road surface.\n4. Enter the road landmark and ward.\nOnce submitted, you receive a CFX reference code to track live progress.',
          hi: 'सड़क के गड्ढे की शिकायत करने के लिए:\n1. "+ समस्या दर्ज करें" पर क्लिक करें।\n2. "सड़कें और गड्ढे" श्रेणी चुनें।\n3. फोटो साक्ष्य अपलोड करें।\n4. वार्ड और सड़क का पता भरें।\nदर्ज होने पर आपको CFX ट्रैकिंग कोड मिलेगा।',
          mr: 'रस्त्यावरील खड्ड्याची तक्रार करण्यासाठी "+ तक्रार नोंदवा" वर क्लिक करा, योग्य प्रभाग व फोटो जोडा.',
          ta: 'சாலை பள்ளம் குறித்து புகார் அளிக்க "+ புகார் அளிக்கவும்" கிளிக் செய்து புகைப்படத்துடன் சமர்ப்பிக்கவும்.',
          bn: 'রাস্তার গর্তের অভিযোগ করতে "+ অভিযোগ দায়ের করুন" বাটনে ক্লিক করে ছবি সহ জমা দিন।',
        }[currentLang];
      } else if (q.includes('status') || q.includes('track') || q.includes('స్థితి') || q.includes('ట్రాక్') || q.includes('स्थिति')) {
        botResponse = {
          te: 'మీ ఫిర్యాదు స్థితిని తనిఖీ చేయడానికి "డ్యాష్‌బోర్డ్" లోకి వెళ్లండి. అక్కడ Submitted (సమర్పించబడింది), In Progress (పని జరుగుతోంది), Resolved (పరిష్కరించబడింది) టైమ్‌లైన్ కనిపిస్తుంది. అలాగే అధికారులు స్పందిస్తే మీకు లాగిన్ సమయంలో పాప్-అప్ మరియు నోటిఫికేషన్ వస్తుంది.',
          en: 'You can track all your complaints in your Citizen Dashboard. You will see real-time status transitions (Submitted → Under Review → In Progress → Resolved), plus you get an automatic popup whenever an administrator responds!',
          hi: 'आप अपने डैशबोर्ड में शिकायत की स्थिति ट्रैक कर सकते हैं। प्रशासनिक अधिकारी के उत्तर देने पर आपको तत्काल सूचना मिलेगी।',
          mr: 'आपल्या डॅशबोर्डवर तक्रारीची सद्यस्थिती तपासा. अधिकाऱ्यांच्या प्रतिसादाची थेट सूचना मिळेल.',
          ta: 'டாஷ்போர்டில் உங்கள் புகாரின் தற்போதைய நிலையை அறியலாம்.',
          bn: 'ড্যাশবোর্ডে আপনার অভিযোগের লাইভ অগ্রগতি ট্র্যাক করতে পারবেন।',
        }[currentLang];
      } else if (q.includes('emergency') || q.includes('water') || q.includes('నీరు') || q.includes('కరెంట్') || q.includes('बिजली')) {
        botResponse = {
          te: 'నీటి సరఫరా లీకేజీ లేదా విద్యుత్ ప్రమాదాలు "Critical" విభాగం కిందకు వస్తాయి. తక్షణమే మున్సిపల్ ఎమర్జెన్సీ డిస్పాచ్ బృందం అప్రమత్తం అవుతుంది.',
          en: 'Water pipeline bursts and fallen electrical poles are categorized under "Critical" severity. Municipal rapid dispatch units are alerted within 30 minutes.',
          hi: 'पानी का रिसाव या बिजली की समस्या को "अति गंभीर" श्रेणी में दर्ज करें ताकि तत्काल टीम पहुंचे।',
          mr: 'तातडीच्या कामासाठी क्रिटिकल श्रेणी निवडा.',
          ta: 'அவசர சிக்கல்களுக்கு உடனடி தீர்வு வழங்கப்படும்.',
          bn: 'জরুরি পরিস্থিতিতে দ্রুত পদক্ষেপ নেওয়া হয়।',
        }[currentLang];
      } else {
        botResponse = {
          te: 'సివిక్‌ఫిక్స్ పౌర సేవా పోర్టల్‌లో మీరు రోడ్లు, వీధి దీపాలు, మురుగునీరు, చెత్త సమస్యలను ఫోటోతో నమోదు చేయవచ్చు. మీకు నిర్దిష్ట సహాయం కావాలంటే పైన ఉన్న బటన్ల ద్వారా సమస్యను సమర్పించవచ్చు.',
          en: 'CivicFix is designed to streamline public grievance resolution. You can report civic problems with photos, track GIS pins on our City Map, view verified fixes in the Wall of Resolutions, or chat with authorities.',
          hi: 'सिविकफिक्स एक पारदर्शी नागरिक सेवा मंच है। आप फोटो के साथ बुनियादी ढांचे की शिकायत दर्ज कर सकते हैं और मानचित्र पर प्रगति देख सकते हैं।',
          mr: 'सिव्हिकफिक्स हे पारदर्शक नागरी सेवा व्यासपीठ आहे.',
          ta: 'சிவிக்பிக்ஸ் மூலம் உங்கள் பகுதி குறைகளை எளிதாக தீர்க்கலாம்.',
          bn: 'সিভিকফিক্স নাগরিক সমস্যা সমাধানের একটি নির্ভরযোগ্য মাধ্যম।',
        }[currentLang];
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            sender: 'bot',
            text: botResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 500);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'bot',
          text: 'Thank you for reaching out. Please feel free to submit an official report or check your dashboard.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 group"
          aria-label="Open Civic AI Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pr-1">
            {t.chatbot.title}
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 ${
            isDark
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : 'bg-white border-neutral-300 text-neutral-900'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 px-4 bg-teal-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-700/80">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black leading-tight flex items-center gap-1.5">
                  <span>{t.chatbot.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[10px] text-teal-100 block">{t.chatbot.subtitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-teal-700 text-teal-100 hover:text-white"
                aria-label="Minimize chatbot"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-teal-700 text-teal-100 hover:text-white"
                aria-label="Close chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <button
              onClick={() => handleSendMessage(t.chatbot.suggest1)}
              className="px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.chatbot.suggest1}
            </button>
            <button
              onClick={() => handleSendMessage(t.chatbot.suggest2)}
              className="px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.chatbot.suggest2}
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-xs font-medium'
                      : isDark
                      ? 'bg-neutral-800 text-neutral-100 rounded-tl-xs border border-neutral-700'
                      : 'bg-neutral-100 text-neutral-800 rounded-tl-xs border border-neutral-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-neutral-400 block text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-neutral-400 text-xs italic">
                <Bot className="w-4 h-4 text-teal-600 animate-spin" />
                <span>Civic Assistant is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatbot.placeholder}
              className="flex-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
