"use client";
import { useState, useEffect } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";

export default function DailyCodex() {
  const [sessionId, setSessionId] = useState("");
  const [userData, setUserData] = useState({ archetype: "Sage", shadowLevel: 65 }); // Мок-данные для теста
  const [dailyRitual, setDailyRitual] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Статус подписки (из БД)
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // 1. Ловим/генерируем session_id
    let id = localStorage.getItem("aura_session_id") || "_" + Math.random().toString(36).substr(2, 9);
    setSessionId(id);
    localStorage.setItem("aura_session_id", id);

    // Устанавливаем текущую дату
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("en-US", { month: "SHORT", day: "NUMERIC" }).toUpperCase());

    // 2. Делаем запрос на бэкенд, чтобы затянуть данные о юзере и ритуал на сегодня
    fetchDailyCodex(id);
  }, []);

  const fetchDailyCodex = async (id) => {
    setIsAnalyzing(true);
    try {
      // Маршрут вернет архетип, уровень Тени и ритуал из кэша или сгенерирует новый
      const response = await fetch(`/api/alchemy-get?session_id=${id}`);
      const data = await response.json();

      if (data) {
        setUserData({ archetype: data.archetype, shadowLevel: data.shadowLevel });
        setDailyRitual(data.ritual);
        setIsSubscribed(data.isSubscribed); // БД знает, оплачена ли подписка
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-void text-mystic font-sans">
      {/* Фон в алхимических тонах */}
      <AuraBackground activeType="tarot" isResult={true} /> 
      {isAnalyzing && <SmokeLoader text="Calibrating Daily Codex..." />}

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        
        {/* ХЕДЕР (Кодекс дня) */}
        <div className="text-center mb-10 animate-fade-in w-full bg-obsidian-glass/60 border border-slate-900 p-6 rounded-2xl shadow-aura-glow flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif tracking-wider text-slate-100 uppercase">Shadow Alchemy</h1>
            <p className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">The Daily Codex Protocol</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-600 block uppercase font-mono">CYCLE CYCLE</span>
            <span className="text-sm text-cyan-300 font-bold font-mono">{currentDate}</span>
          </div>
        </div>

        {/* 📋 ПАНЕЛЬ ПОЛЬЗОВАТЕЛЯ (ТЕКУЩАЯ МАТРИЦА) */}
        <div className="w-full bg-void/60 border border-slate-900 p-5 rounded-2xl mb-6 shadow-inner flex justify-between font-mono animate-fade-in delay-100">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">MAPPED ARCHETYPE</span>
            <span className="text-sm text-mystic font-bold uppercase tracking-wider">{userData.archetype}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider">SHADOW DENSITY</span>
            <span className="text-sm text-purple-400 font-bold">{userData.shadowLevel}%</span>
          </div>
        </div>

        {/* ========================================== */}
        {/* 🧪 ЕЖЕДНЕВНЫЙ РИТУАЛ (ПОД ПЕЙВОЛЛОМ) */}
        {/* ========================================== */}
        {dailyRitual ? (
          isSubscribed ? (
            // ЕСЛИ ПОДПИСКА ЕСТЬ — ПОКАЗЫВАЕМ КОНТЕНТ
            <div className="w-full bg-obsidian-glass/50 backdrop-blur-lg border border-slate-800/50 p-6 md:p-8 rounded-3xl shadow-aura-glow animate-fade-in delay-200 overflow-y-auto max-h-[60vh] scrollbar-thin">
              <div className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                {dailyRitual}
              </div>
            </div>
          ) : (
            // ЕСЛИ ПОДПИСКИ НЕТ — ПОКАЗЫВАЕМ КРИПТО-ПЕЙВОЛЛ
            <div className="w-full bg-obsidian-glass/70 backdrop-blur-lg border border-purple-900/40 p-10 rounded-3xl text-center shadow-aura-glow animate-fade-in delay-200">
              <div className="mb-6 relative">
                <span className="text-6xl animate-pulse block">🔒</span>
                <div className="absolute inset-0 bg-aura/15 blur-2xl rounded-full"></div>
              </div>
              <h2 className="text-2xl font-serif text-slate-100 tracking-wider mb-3">Today's Codex is Locked</h2>
              <p className="text-xs text-slate-400 font-light max-w-sm mx-auto mb-8 leading-relaxed">
                Your alchemical core requires stability matrix. Unlock daily CBT practices, personalized integration strategies, and neuro-amulets.
              </p>
              <button 
                onClick={() => alert("Crypto Subscription (CryptoCloud USDT) will activate post-deployment!")}
                className="w-full max-w-xs bg-aura hover:bg-purple-700 text-white py-3.5 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 shadow-lg active:scale-[0.98]"
              >
                [ Access Daily Codex - 1.00 USDT/Week ]
              </button>
            </div>
          )
        ) : (
          <p className="text-xs text-slate-600 animate-pulse mt-10">Syncing Matrix...</p>
        )}

        {/* 🔄 ECOSYSTEM RETURN BUTTONS */}
        <div className="w-full mt-12 grid grid-cols-2 gap-4 animate-fade-in delay-300">
          <a
            href={`https://aura-ai.vercel.app/?session_id=${sessionId}`}
            className="block text-center border border-slate-900 hover:border-slate-700 text-slate-600 hover:text-mystic py-3.5 rounded-xl font-mono tracking-widest text-[10px] uppercase transition-colors"
          >
            ← Check Dream Matrix
          </a>
          <a
            href={`https://shadow-mirror.vercel.app/?session_id=${sessionId}`}
            className="block text-center border border-slate-900 hover:border-slate-700 text-slate-600 hover:text-mystic py-3.5 rounded-xl font-mono tracking-widest text-[10px] uppercase transition-colors"
          >
            Rescan Identity →
          </a>
        </div>

      </div>
    </main>
  );
}