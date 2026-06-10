"use client";
import { useState, useEffect } from "react";
// Добавляем стильные иконки
import { ShieldCheck, Zap, Lock, BookOpen, Key, Coins } from "lucide-react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";

// Компонент стилизованной кнопки с глитч-эффектом и свечением при ховере
const AuraButton = ({ children, onClick, icon: Icon, variant = "primary", className = "" }) => {
  const baseClasses = "relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-mono tracking-widest text-xs uppercase font-medium transition-all duration-300 active:scale-[0.98] group overflow-hidden select-none";
  
  const variants = {
    primary: "bg-aura text-white hover:bg-purple-700 shadow-aura-glow",
    cyber: "bg-cyber text-void hover:bg-teal-400 shadow-cyber-glow",
    outline: "bg-transparent border border-slate-900 text-slate-500 hover:border-slate-700 hover:text-mystic",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {/* 🔮 Внутренний эффект 'глитча' при ховере */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
      
      {Icon && <Icon size={16} className="relative z-10 transition-transform group-hover:rotate-12" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Компонент мини-карточки данных с анимацией при ховере
const DataNode = ({ label, value, icon: Icon, color = "mystic" }) => (
  <div className={`border border-slate-900 bg-void/50 p-4 rounded-xl shadow-inner group transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5`}>
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon size={12} className={`text-slate-600 transition-colors group-hover:text-${color === 'purple' ? 'purple-400' : 'cyber'}`} />}
      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{label}</span>
    </div>
    <span className={`text-base font-bold font-mono tracking-wider text-${color === 'purple' ? 'purple-400' : 'mystic'} group-hover:text-white transition-colors`}>{value}</span>
  </div>
);

export default function DailyCodex() {
  const [sessionId, setSessionId] = useState("");
  // Мок-данные для теста визуала
  const [userData, setUserData] = useState({ archetype: "Rebel", shadowLevel: 82 }); 
  const [dailyRitual, setDailyRitual] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Для теста пейволла
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("aura_session_id") || "_" + Math.random().toString(36).substr(2, 9);
    setSessionId(id);
    localStorage.setItem("aura_session_id", id);
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("en-US", { month: "SHORT", day: "NUMERIC" }).toUpperCase());
    fetchDailyCodex(id);
  }, []);

  const fetchDailyCodex = async (id) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/alchemy-get?session_id=${id}`);
      const data = await response.json();
      if (data) {
        // Мы используем мок-данные архетипа Rebell для теста визуала
        setUserData({ archetype: data.archetype, shadowLevel: data.shadowLevel });
        setDailyRitual(data.ritual);
        setIsSubscribed(data.isSubscribed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Искуственная задержка для теста стильного лоадера
      setTimeout(() => setIsAnalyzing(false), 2500);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-void text-mystic font-sans">
      {/* 🌌 Улучшенный фон в сине-фиолетовых тонах Alchemy */}
      <AuraBackground activeType="tarot" isResult={true} /> 
      {isAnalyzing && <SmokeLoader text="DECRYPTING CODEX MATRIX..." />}

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        
        {/* ХЕДЕР (С легким неоновым свечением) */}
        <div className="text-center mb-10 animate-fade-in w-full bg-obsidian-glass/60 backdrop-blur-md border border-slate-800/40 p-6 rounded-2xl shadow-aura-glow flex items-center justify-between transition-all duration-300 hover:border-aura/30 hover:shadow-aura-glow-large">
          <div>
            <h1 className="text-xl md:text-2xl font-serif tracking-wider text-slate-100 uppercase flex items-center gap-2">
              <Zap size={18} className="text-purple-400" />
              Shadow Alchemy
            </h1>
            <p className="text-[10px] text-purple-400/70 font-mono tracking-widest uppercase mt-0.5">The Daily Codex Protocol</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-600 block uppercase font-mono">Current Cycle</span>
            <span className="text-sm text-cyan-300 font-bold font-mono tracking-tight">{currentDate}</span>
          </div>
        </div>

        {/* 📋 ПАНЕЛЬ ДАННЫХ (DataNodes) */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6 animate-fade-in delay-100">
          <DataNode 
            label="MAPPED ARCHETYPE" 
            value={userData.archetype} 
            icon={ShieldCheck} 
            color="cyber"
          />
          <DataNode 
            label="SHADOW DENSITY" 
            value={`${userData.shadowLevel}%`} 
            icon={Zap} 
            color="purple"
          />
        </div>

        {/* ========================================== */}
        {/* 🧪 РИТУАЛ ИЛИ ПЕЙВОЛЛ */}
        {/* ========================================== */}
        {dailyRitual ? (
          isSubscribed ? (
            // ЕСЛИ ОПЛАЧЕНО — СТИЛИЗОВАННЫЙ ТЕКСТ
            <div className="w-full bg-obsidian-glass/50 backdrop-blur-lg border border-slate-800/50 p-6 md:p-8 rounded-3xl shadow-aura-glow animate-fade-in delay-200 overflow-y-auto max-h-[55vh] scrollbar-thin transition-all duration-300 hover:border-cyber/30 hover:shadow-cyber-glow-large group">
              <BookOpen size={20} className="text-cyber/60 mb-6 group-hover:text-cyber transition-colors" />
              <div className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                {dailyRitual}
              </div>
            </div>
          ) : (
            // ЕСЛИ НЕ ОПЛАЧЕНО — УЛУЧШЕННЫЙ ПЕЙВОЛЛ
            <div className="w-full bg-obsidian-glass/70 backdrop-blur-xl border border-purple-900/40 p-8 md:p-12 rounded-3xl text-center shadow-aura-glow animate-fade-in delay-200">
              <div className="mb-6 relative flex justify-center">
                <Lock size={60} className="text-aura animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-aura/15 blur-3xl rounded-full scale-150"></div>
              </div>
              <h2 className="text-2xl font-serif text-slate-100 tracking-wider mb-2">Today's Codex is Locked</h2>
              <p className="text-xs text-slate-500 font-light max-w-sm mx-auto mb-10 leading-relaxed">
                Your neural matrix is fluctuating. Unlock daily CBT integration strategies, personalized dream triggers, and shadow compatibility graphs.
              </p>
              <AuraButton 
                onClick={() => alert("Crypto API Gateway (CryptoCloud USDT) is offline in dev mode.")}
                variant="primary"
                icon={Coins}
                className="max-w-sm mx-auto shadow-aura-glow-large"
              >
                Access Daily Codex — 1.00 USDT
              </AuraButton>
              <p className="text-[10px] text-slate-600 font-mono mt-5 tracking-widest uppercase">[ One-Time Activation ]</p>
            </div>
          )
        ) : (
          <p className="text-xs text-slate-600 animate-pulse mt-10">Syncing Matrix...</p>
        )}

        {/* 🔄 ECOSYSTEM NAVIGATION (Кнопки-outline при ховере) */}
        <div className="w-full mt-12 grid grid-cols-2 gap-4 animate-fade-in delay-300">
          <AuraButton 
            onClick={() => window.location.href = `https://aura-ai.vercel.app/?session_id=${sessionId}`} 
            variant="outline"
            className="border border-slate-900 hover:border-slate-700 hover:text-white"
          >
            ← Dream Matrix
          </AuraButton>
          <AuraButton 
            onClick={() => window.location.href = `https://shadow-mirror.vercel.app/?session_id=${sessionId}`} 
            variant="outline"
            className="border border-slate-900 hover:border-slate-700 hover:text-white"
          >
            Rescan Identity →
          </AuraButton>
        </div>

      </div>
    </main>
  );
}