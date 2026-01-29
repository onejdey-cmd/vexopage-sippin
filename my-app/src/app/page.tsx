"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// --- CZĄSTECZKI NA CAŁY EKRAN ---
const FullScreenParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    const colors = ["#a855f7", "#ec4899", "#ffffff", "#6366f1"];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-60" />;
};

// --- HEADER Z EFEKTEM LIGHT SWEEP ---
const LightSweepHeader = () => {
  return (
    <div className="relative text-center mb-2">
        {/* Definicja animacji shimmer jest tutaj i działa globalnie */}
        <style jsx global>{`
             @keyframes shimmer {
               0% { background-position: -200% center; }
               100% { background-position: 200% center; }
             }
             .animate-shimmer {
                animation: shimmer 2.5s linear infinite;
             }
        `}</style>
      <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-white via-purple-400 to-purple-600 bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
        Wielki Turniej VEXO
      </h2>
    </div>
  );
};

// --- GŁÓWNY NAPIS VEXO ---
const ExplodingText = () => {
  const text = "VEXO";
  return (
    <motion.div 
      className="relative z-30 cursor-crosshair text-[100px] md:text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-400 to-purple-800 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] select-none text-center"
      initial="rest"
      whileHover="explode"
      animate="rest"
    >
      <div className="flex justify-center items-center">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              rest: { 
                x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              },
              explode: {
                x: (Math.random() - 0.5) * 800, 
                y: (Math.random() - 0.5) * 800,
                rotate: (Math.random() - 0.5) * 180,
                scale: Math.random() * 1.5 + 0.5,
                opacity: 0, 
                filter: "blur(15px)",
                transition: { duration: 0.3, ease: "easeOut" }
              }
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default function FortniteWorkshop() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.5); 
  const [playing, setPlaying] = useState(false);

  const handleUserInteraction = () => {
    if (!playing) setPlaying(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <main 
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white font-sans selection:bg-purple-500 selection:text-white"
      onClick={handleUserInteraction}
    >
      
      {/* PLAYER */}
      <div className="hidden">
        <ReactPlayer
          url="https://youtu.be/WAAAhylEvEs?si=Y8dKJb_aRIOKy-h5"
          playing={playing}
          volume={volume}
          loop={true}
          playsinline={true}
        />
      </div>

      {/* SUWAK GŁOŚNOŚCI */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2"
      >
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105">
           <span className="text-xl">{volume === 0 ? "🔇" : volume > 0.6 ? "🔊" : "🔉"}</span>
           <input 
            type="range" min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-purple-500 hover:accent-pink-500"
          />
        </div>
      </motion.div>

      {/* --- NOWOŚĆ: SPONSOR (Prawy Dolny - BIAŁY LIGHT SWEEP) --- */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        // Zmiana: items-center, text-center, biały border
        className="fixed bottom-5 right-5 z-40 flex flex-col items-center text-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
            Główny Sponsor Turnieju
        </span>
        {/* Zmiana: Biały gradient, animate-shimmer, biały drop-shadow */}
        <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white via-gray-400 to-gray-400 bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
            MAD DOG
        </span>
      </motion.div>

      {/* TŁO */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://cdn.discordapp.com/attachments/1448732312970989662/1466218316476711002/Zrzut_ekranu_2026-01-29_003356.png?ex=697bf1b7&is=697aa037&hm=99b5652fd764384cbc295c5fb4c2cf5c713d4fccc1ffa7b6ad98e731247ca44a&" 
          alt="Tło"
          className="w-full h-full object-cover opacity-40 blur-[3px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* CZĄSTECZKI */}
      <FullScreenParticles />

      {/* FOOTER TŁO */}
      <div className="fixed bottom-0 w-full flex justify-center z-0 pointer-events-none opacity-20">
        <h1 className="text-[12vw] font-black text-transparent bg-clip-text bg-gradient-to-t from-purple-900 to-transparent leading-none whitespace-nowrap blur-sm">
          SIPPIN GEEKS
        </h1>
      </div>

      {/* --- CENTRUM DOWODZENIA (WRAPPER) --- */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-2xl px-4 py-10 mt-10">
        
        {/* LOGO, LIGHT SWEEP I VEXO */}
        <div className="mb-8 text-center flex flex-col items-center">
            
            <motion.img 
              src="https://cdn.discordapp.com/attachments/1448732312970989662/1466222033078583458/Zrzut_ekranu_2026-01-14_193121-removebg-preview.png?ex=697bf52d&is=697aa3ad&hm=cd0a306041d56498d3af148a3c96a6e9d724041d6419df384d814a35707eb43b&"
              alt="Vexo Logo"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-48 h-auto mb-6 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            />

            <LightSweepHeader />
            <ExplodingText />
        </div>

        {/* --- FORMULARZ --- */}
        <div className="w-full relative max-w-[500px]">
          <div className="absolute inset-0 bg-purple-600/30 blur-[60px] rounded-full pointer-events-none" />

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form-wrapper"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                {/* NAPIS ZGŁOSZENIA */}
                <h3 className="text-center text-2xl font-black text-white tracking-[0.4em] mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                  ZGŁOSZENIA
                </h3>

                <form 
                  className="relative bg-black/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
                  onSubmit={handleSubmit}
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_10px_#a855f7]" />

                  <div className="space-y-5">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] ml-1">Nick z Gry</label>
                      <input required type="text" placeholder="WPISZ NICK..." className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all outline-none font-bold" />
                    </motion.div>

                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] ml-1">Poziom</label>
                      <input required type="number" placeholder="NP. 250" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all outline-none font-bold" />
                    </motion.div>

                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] ml-1">Ulubiona Broń</label>
                      <select className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 transition-all outline-none font-bold cursor-pointer">
                        <option className="bg-black">🔫 Shotgun (Pompa)</option>
                        <option className="bg-black">🎯 Snajperka</option>
                        <option className="bg-black">⛏️ Kilof</option>
                        <option className="bg-black">🧱 Na gołe łapy!</option>
                      </select>
                    </motion.div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                      className="w-full mt-4 bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-[length:200%_auto] hover:animate-gradient-x text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                    >
                      {loading ? "WERYFIKACJA..." : "ZAPISZ SIĘ"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // --- SUKCES ---
              <motion.div 
                key="success"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black/80 backdrop-blur-xl border border-green-500/50 p-10 rounded-3xl text-center shadow-[0_0_80px_rgba(34,197,94,0.3)] w-full max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                  <span className="text-4xl">🏆</span>
                </div>
                
                <h2 className="text-4xl font-black text-white mb-2 italic">ZAKWALIFIKOWANY!</h2>
                <p className="text-green-400 font-bold uppercase tracking-widest text-sm mb-6">Widzimy się na lobby</p>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3 text-left">
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-xs uppercase font-bold">Data</span>
                        <span className="text-yellow-400 font-bold">29.01</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-500 text-xs uppercase font-bold">Godzina</span>
                         <span className="text-white font-bold">12:00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                         <span className="text-gray-500 text-xs uppercase font-bold mt-1">Lokalizacja</span>
                         <span className="text-purple-400 font-black">SIPPIN GEEKS (DC)</span>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}