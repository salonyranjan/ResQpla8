import { useState, useRef, useEffect, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineChevronDown,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { Groq } from "groq-sdk";

const SYSTEM_INSTRUCTION = `You are ResQBot, the assistant for ResQPlate, a platform for listing, discovering, claiming, and tracking surplus food.

Your role:
- Help users donate surplus food and navigate donation listings
- Help users browse available food donations
- Explain how ResQPlate works (listing food, claiming donations, logistics)
- Answer questions about food safety, storage, and handling
- Provide eco-conscious advice on reducing food waste

Only describe features that exist in the product. Do not claim that an organization is verified, insured, government-backed, or partnered unless the user provides that information. For urgent food-safety concerns, recommend guidance from a qualified local authority.

Tone: clear, concise, and professional. Use short paragraphs and no more than four bullets. If a question is outside food rescue, politely redirect to ResQPlate topics.`;

const QUICK_REPLIES = [
  { label: "How do I donate food?", emoji: "🍱" },
  { label: "Browse available food", emoji: "📍" },
  { label: "Food safety tips", emoji: "🛡️" },
  { label: "Track my donation", emoji: "📦" },
];

let groqClient = null;
try {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (key) {
    groqClient = new Groq({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });
  }
} catch (e) {
  console.error("Groq init failed:", e);
}

const FALLBACK_MESSAGE = "I couldn't reach the assistant service. Please try again in a moment.";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const themes = {
  dark: {
    windowBg: "#0f1117",
    windowBorder: "rgba(52,211,153,0.18)",
    windowShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(52,211,153,0.1), 0 8px 32px rgba(0,0,0,0.5)",
    headerBg: "linear-gradient(135deg, #0a2218 0%, #0d2f22 50%, #0b261c 100%)",
    headerBorder: "rgba(52,211,153,0.15)",
    msgAreaBg: "#0a0d11",
    botBubbleBg: "#161b22",
    botBubbleBorder: "rgba(52,211,153,0.12)",
    botBubbleText: "#d1fae5",
    botBubbleShadow: "0 2px 8px rgba(0,0,0,0.3)",
    userBubbleBg: "linear-gradient(135deg, #059669, #047857)",
    userBubbleText: "#ffffff",
    userBubbleShadow: "0 4px 16px rgba(5,150,105,0.35)",
    timestampColor: "#4b5563",
    typingDotColor: "#10b981",
    inputAreaBg: "#0d1117",
    inputAreaBorder: "rgba(52,211,153,0.1)",
    inputBg: "#161b22",
    inputBorder: "rgba(52,211,153,0.15)",
    inputBorderFocus: "rgba(52,211,153,0.5)",
    inputRingFocus: "rgba(52,211,153,0.1)",
    inputText: "#d1fae5",
    inputPlaceholder: "#4b5563",
    iconBtnColor: "rgba(209,250,229,0.5)",
    iconBtnHover: "rgba(209,250,229,0.9)",
    iconBtnHoverBg: "rgba(52,211,153,0.08)",
    actionBtnBg: "linear-gradient(135deg, #059669, #047857)",
    actionBtnBgDisabled: "#1f2937",
    actionBtnIconActive: "#ffffff",
    actionBtnIconDisabled: "#374151",
    quickBg: "rgba(52,211,153,0.06)",
    quickBorder: "rgba(52,211,153,0.2)",
    quickText: "#34d399",
    quickHoverBg: "rgba(52,211,153,0.12)",
    quickHoverBorder: "rgba(52,211,153,0.4)",
    imgPreviewBg: "#161b22",
    imgPreviewBorder: "rgba(52,211,153,0.12)",
    imgRemoveText: "#9ca3af",
    footerText: "#374151",
    fabBg: "linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)",
    fabShadow: "0 4px 24px rgba(5,150,105,0.5)",
    scrollbarThumb: "#1f2937",
    scrollbarTrack: "#0a0d11",
    statusDotColor: "#34d399",
    statusText: "rgba(209,250,229,0.5)",
    onlineBadgeBg: "rgba(52,211,153,0.1)",
    onlineBadgeBorder: "rgba(52,211,153,0.2)",
    onlineBadgeText: "#34d399",
  },
  light: {
    windowBg: "#ffffff",
    windowBorder: "rgba(5,150,105,0.12)",
    windowShadow: "0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(5,150,105,0.08), 0 4px 16px rgba(0,0,0,0.06)",
    headerBg: "linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)",
    headerBorder: "rgba(255,255,255,0.1)",
    msgAreaBg: "#f0fdf4",
    botBubbleBg: "#ffffff",
    botBubbleBorder: "rgba(0,0,0,0.06)",
    botBubbleText: "#1a3a2a",
    botBubbleShadow: "0 2px 8px rgba(0,0,0,0.06)",
    userBubbleBg: "linear-gradient(135deg, #059669, #047857)",
    userBubbleText: "#ffffff",
    userBubbleShadow: "0 4px 16px rgba(5,150,105,0.25)",
    timestampColor: "#9ca3af",
    typingDotColor: "#059669",
    inputAreaBg: "#ffffff",
    inputAreaBorder: "rgba(0,0,0,0.06)",
    inputBg: "#f9fafb",
    inputBorder: "rgba(0,0,0,0.08)",
    inputBorderFocus: "rgba(5,150,105,0.4)",
    inputRingFocus: "rgba(5,150,105,0.08)",
    inputText: "#1a3a2a",
    inputPlaceholder: "#9ca3af",
    iconBtnColor: "rgba(255,255,255,0.75)",
    iconBtnHover: "rgba(255,255,255,1)",
    iconBtnHoverBg: "rgba(255,255,255,0.15)",
    actionBtnBg: "linear-gradient(135deg, #059669, #047857)",
    actionBtnBgDisabled: "#e5e7eb",
    actionBtnIconActive: "#ffffff",
    actionBtnIconDisabled: "#9ca3af",
    quickBg: "#f0fdf4",
    quickBorder: "rgba(5,150,105,0.2)",
    quickText: "#059669",
    quickHoverBg: "#dcfce7",
    quickHoverBorder: "rgba(5,150,105,0.4)",
    imgPreviewBg: "#f9fafb",
    imgPreviewBorder: "rgba(0,0,0,0.06)",
    imgRemoveText: "#6b7280",
    footerText: "#d1d5db",
    fabBg: "linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)",
    fabShadow: "0 4px 20px rgba(5,150,105,0.4)",
    scrollbarThumb: "#bbf7d0",
    scrollbarTrack: "#f0fdf4",
    statusDotColor: "#86efac",
    statusText: "rgba(255,255,255,0.75)",
    onlineBadgeBg: "rgba(255,255,255,0.15)",
    onlineBadgeBorder: "rgba(255,255,255,0.2)",
    onlineBadgeText: "rgba(255,255,255,0.9)",
  },
};

function BotAvatar({ size = 28, pulse = false, borderColor = "#0a0d11" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #064e3b, #059669)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: pulse
          ? "0 0 0 3px rgba(52,211,153,0.2), 0 0 12px rgba(52,211,153,0.3)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        fontSize: size * 0.52,
        lineHeight: 1,
        userSelect: "none",
        position: "relative",
      }}
    >
      🤖
      {pulse && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: "#34d399",
            border: `2px solid ${borderColor}`,
            animation: "resqPulse 2s infinite",
          }}
        />
      )}
    </div>
  );
}

function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <Motion.span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            display: "block",
          }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, t }) {
  const isUser = msg.sender === "user";
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {!isUser && <BotAvatar size={30} />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxWidth: "76%",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {msg.imagePreview && (
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.botBubbleBorder}`, boxShadow: t.botBubbleShadow }}>
            <img src={msg.imagePreview} alt="attachment" style={{ width: 160, height: 120, objectFit: "cover", display: "block" }} />
          </div>
        )}

        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              padding: "10px 14px",
              borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              fontSize: 13.5,
              lineHeight: 1.6,
              background: isUser ? t.userBubbleBg : t.botBubbleBg,
              color: isUser ? t.userBubbleText : t.botBubbleText,
              border: isUser ? "none" : `1px solid ${t.botBubbleBorder}`,
              boxShadow: isUser ? t.userBubbleShadow : t.botBubbleShadow,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
            aria-label={isUser ? "Your message" : "ResQBot response"}
          >
            {msg.text}
          </div>

          {!isUser && hovered && (
            <Motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCopy}
              title="Copy"
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 22,
                height: 22,
                borderRadius: 6,
                background: t.botBubbleBg,
                border: `1px solid ${t.botBubbleBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: copied ? "#34d399" : t.inputPlaceholder,
                zIndex: 2,
              }}
            >
              {copied
                ? <HiOutlineCheckCircle style={{ width: 12, height: 12 }} />
                : <HiOutlineClipboardDocument style={{ width: 12, height: 12 }} />
              }
            </Motion.button>
          )}
        </div>

        <span style={{ fontSize: 10, color: t.timestampColor, padding: "0 4px" }}>
          {formatTime(msg.id)}
        </span>
      </div>
    </Motion.div>
  );
}

function HeaderBtn({ onClick, title, children, t }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "none",
        background: hovered ? t.iconBtnHoverBg : "transparent",
        color: hovered ? t.iconBtnHover : t.iconBtnColor,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function ActionBtn({ onClick, disabled, active, children, t, title }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileTap={!disabled ? { scale: 0.88 } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 38,
        height: 38,
        flexShrink: 0,
        borderRadius: 12,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? t.actionBtnBg : t.actionBtnBgDisabled,
        color: active ? t.actionBtnIconActive : t.actionBtnIconDisabled,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        transform: hovered && !disabled ? "translateY(-1px)" : "none",
        boxShadow: active && !disabled ? "0 4px 12px rgba(5,150,105,0.35)" : "none",
      }}
    >
      {children}
    </Motion.button>
  );
}

export default function ResQBot() {
  const { user } = useAuth();
  const { dark: isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatHistoryRef = useRef([]);
  const requestIdRef = useRef(0);
  const t = isDark ? themes.dark : themes.light;

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isMinimized]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsMinimized(false);
      setHasUnread(false);
      chatHistoryRef.current = [];
      const name = user?.name?.split(" ")[0];
      const greeting = name
        ? `Hello ${name}. I'm ResQBot. I can help you post surplus food, browse listings, understand pickup statuses, and follow safer food-handling practices.`
        : "Hello. I'm ResQBot. I can help you post surplus food, browse listings, understand pickup statuses, and follow safer food-handling practices.";
      setMessages([{ id: Date.now(), text: greeting, sender: "bot" }]);
    }
  }, [isOpen, messages.length, user]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text ?? inputValue).trim();
      if (!messageText || isTyping) return;

      const userMsg = {
        id: Date.now(),
        text: messageText,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);
      const requestId = ++requestIdRef.current;
      const parts = [{ text: messageText }];

      chatHistoryRef.current.push({ role: "user", parts });

      try {
        if (!groqClient) throw new Error("Groq client not initialized");

        // Build messages array for Groq
        const messages = [{ role: "system", content: SYSTEM_INSTRUCTION }];

        // Convert chat history to Groq format
        chatHistoryRef.current.forEach(entry => {
          const text = entry.parts.map(p => p.text).filter(Boolean).join(" ");
          if (!text) return;
          if (entry.role === "user") {
            messages.push({ role: "user", content: text });
          } else if (entry.role === "model") {
            messages.push({ role: "assistant", content: text });
          }
        });

        const response = await groqClient.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.7,
          max_tokens: 200,
        });

        const responseText = response.choices[0].message.content.trim();

        if (requestId !== requestIdRef.current) return;
        chatHistoryRef.current.push({ role: "model", parts: [{ text: responseText }] });
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: responseText, sender: "bot" }]);

        if (!isOpen || isMinimized) setHasUnread(true);
      } catch (error) {
        console.error("Groq error:", error);
        if (requestId !== requestIdRef.current) return;
        chatHistoryRef.current.pop();

        const errText = FALLBACK_MESSAGE;
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: errText, sender: "bot" }]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, isOpen, isMinimized]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    requestIdRef.current += 1;
    chatHistoryRef.current = [];
    setIsTyping(false);
    const name = user?.name?.split(" ")[0];
    const greeting = name
      ? `Chat cleared! Hello again **${name}** 👋 How can I help?`
      : "Chat cleared! How can I help you? 👋";
    setMessages([{ id: Date.now(), text: greeting, sender: "bot" }]);
  };

  const toggleOpen = () => {
    if (isOpen && !isMinimized) {
      setIsOpen(false);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
      setHasUnread(false);
    } else {
      setIsMinimized(false);
      setIsOpen(true);
    }
  };

  const canSend = !!inputValue.trim() && !isTyping;

  return (
    <>
      <style>{`

        @keyframes resqPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes resqGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(52,211,153,0.3); }
          50% { box-shadow: 0 0 18px rgba(52,211,153,0.6); }
        }
        @keyframes resqFabRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .resqbot-wrap { font-family: 'Cabinet Grotesk', 'Segoe UI', sans-serif; }
        .resqbot-scrollbar::-webkit-scrollbar { width: 4px; }
        .resqbot-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .resqbot-scrollbar::-webkit-scrollbar-thumb { border-radius: 4px; background: #1f2937; }
        .resqbot-textarea { font-family: 'Cabinet Grotesk', sans-serif; outline: none; }
        .resqbot-quick-btn { transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
        .resqbot-quick-btn:hover { transform: translateY(-1px); }
        .resqbot-fab-ring {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 2px solid rgba(52,211,153,0.5);
          animation: resqFabRing 2.5s ease-out infinite;
          pointer-events: none;
        }
        .resqbot-header-glow {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent);
          pointer-events: none;
        }
        @media (max-width: 520px) {
          .resqbot-window {
            left: 12px !important;
            right: 12px !important;
            bottom: 84px !important;
            width: auto !important;
            max-width: none !important;
            border-radius: 18px !important;
          }
          .resqbot-messages { height: min(390px, calc(100dvh - 330px)) !important; }
          .resqbot-quick-replies { flex-wrap: nowrap !important; overflow-x: auto !important; }
        }
      `}</style>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 28, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.88 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="resqbot-wrap resqbot-window"
            role="dialog"
            aria-label="ResQBot food rescue assistant"
            style={{
              position: "fixed",
              bottom: 92,
              right: 20,
              width: 370,
              maxWidth: "calc(100vw - 40px)",
              background: isDark ? "rgba(15,17,23,0.85)" : "rgba(255,255,255,0.90)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 20,
              overflow: "hidden",
              zIndex: 1000,
              maxHeight: "calc(100dvh - 112px)",
              boxShadow: t.windowShadow,
              border: `1px solid ${t.windowBorder}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: t.headerBg,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                borderBottom: `1px solid ${t.headerBorder}`,
              }}
            >
              <div className="resqbot-header-glow" />

              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <Motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BotAvatar size={38} pulse borderColor={isDark ? "#0a0d11" : "#047857"} />
                </Motion.div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>
                      ResQBot
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 6,
                      background: t.onlineBadgeBg, border: `1px solid ${t.onlineBadgeBorder}`,
                      color: t.onlineBadgeText, letterSpacing: "0.03em",
                    }}>
                      AI
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: t.statusDotColor, display: "block",
                      animation: "resqGlow 2s infinite",
                    }} />
                    <span style={{ color: t.statusText, fontSize: 11 }}>
                      {groqClient ? "Available · Food rescue help" : "Temporarily unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <HeaderBtn onClick={handleReset} title="Clear chat" t={t}>
                  <HiOutlineTrash style={{ width: 15, height: 15 }} />
                </HeaderBtn>
                <HeaderBtn onClick={() => setIsMinimized((v) => !v)} title={isMinimized ? "Expand" : "Minimize"} t={t}>
                  <HiOutlineChevronDown style={{
                    width: 15, height: 15,
                    transform: isMinimized ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }} />
                </HeaderBtn>
                <HeaderBtn onClick={() => setIsOpen(false)} title="Close" t={t}>
                  <HiOutlineXMark style={{ width: 15, height: 15 }} />
                </HeaderBtn>
              </div>
            </div>

            {/* Body */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <Motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    style={{ position: "relative", height: "min(420px, calc(100dvh - 360px))", minHeight: 220, overflowY: "auto", overscrollBehavior: "contain", background: t.msgAreaBg }}
                    className="resqbot-scrollbar resqbot-messages"
                  >
                    <div
                      style={{
                        position: "relative",
                        padding: "14px 14px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        minHeight: "100%",
                        scrollbarColor: `${t.scrollbarThumb} ${t.scrollbarTrack}`,
                      }}
                    >
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} t={t} />
                    ))}

                    <AnimatePresence>
                      {isTyping && (
                        <Motion.div
                          key="typing"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
                        >
                          <BotAvatar size={30} />
                          <div style={{
                            padding: "10px 14px",
                            borderRadius: "18px 18px 18px 4px",
                            background: t.botBubbleBg,
                            border: `1px solid ${t.botBubbleBorder}`,
                            boxShadow: t.botBubbleShadow,
                          }}>
                            <TypingDots color={t.typingDotColor} />
                          </div>
                          <span style={{ fontSize: 10, color: t.timestampColor, marginBottom: 4 }}>
                            ResQBot is responding…
                          </span>
                        </Motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Quick Replies */}
                  <AnimatePresence>
                    {messages.length <= 1 && !isTyping && (
                      <Motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        className="resqbot-quick-replies"
                        style={{
                          padding: "10px 14px",
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          borderTop: `1px solid ${t.inputAreaBorder}`,
                          background: t.msgAreaBg,
                        }}
                      >
                        {QUICK_REPLIES.map(({ label, emoji }) => (
                          <button
                            key={label}
                            onClick={() => sendMessage(label)}
                            className="resqbot-quick-btn"
                            style={{
                              fontSize: 11.5,
                              fontWeight: 500,
                              padding: "5px 10px",
                              borderRadius: 20,
                              border: `1px solid ${t.quickBorder}`,
                              background: t.quickBg,
                              color: t.quickText,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              fontFamily: "Inter, sans-serif",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = t.quickHoverBg;
                              e.currentTarget.style.borderColor = t.quickHoverBorder;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = t.quickBg;
                              e.currentTarget.style.borderColor = t.quickBorder;
                            }}
                          >
                            {emoji} {label}
                          </button>
                        ))}
                      </Motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input */}
                  <div
                    style={{
                      padding: "10px 12px",
                      background: t.inputAreaBg,
                      borderTop: `1px solid ${inputFocused ? t.inputBorderFocus : t.inputAreaBorder}`,
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, minWidth: 0 }}>
                      <div style={{ flex: 1, position: "relative" }}>
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                          }}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          placeholder="Ask about donating, pickups, or food safety…"
                          rows={1}
                          disabled={isTyping}
                          className="resqbot-textarea"
                          style={{
                            width: "100%",
                            resize: "none",
                            borderRadius: 14,
                            border: `1.5px solid ${inputFocused ? t.inputBorderFocus : t.inputBorder}`,
                            background: t.inputBg,
                            color: t.inputText,
                            fontSize: 13.5,
                            padding: "9px 14px",
                            maxHeight: 96,
                            lineHeight: 1.5,
                            boxSizing: "border-box",
                            transition: "all 0.15s",
                            boxShadow: inputFocused ? `0 0 0 3px ${t.inputRingFocus}` : "none",
                            opacity: isTyping ? 0.5 : 1,
                          }}
                        />
                      </div>
                      <ActionBtn
                        onClick={() => sendMessage()}
                        disabled={!canSend}
                        active={canSend}
                        t={t}
                        title="Send"
                      >
                        <Motion.div
                          animate={canSend ? { x: [0, 2, 0] } : {}}
                          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <HiOutlinePaperAirplane style={{ width: 16, height: 16 }} />
                        </Motion.div>
                      </ActionBtn>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: "4px 0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    background: t.inputAreaBg,
                  }}>
                    <span style={{ fontSize: 10, color: t.footerText, fontFamily: "Inter, sans-serif" }}>
                      ResQPlate assistant · Responses may need verification
                    </span>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <Motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.88 }}
        onClick={toggleOpen}
        title="Open ResQBot"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 18,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          background: t.fabBg,
          boxShadow: t.fabShadow,
          fontSize: 26,
          overflow: "visible",
        }}
      >
        {!isOpen && <div className="resqbot-fab-ring" />}

        <AnimatePresence mode="wait">
          {isOpen && !isMinimized ? (
            <Motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
            >
              <HiOutlineXMark style={{ width: 26, height: 26, color: "#fff" }} />
            </Motion.div>
          ) : (
            <Motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
              style={{ position: "relative", lineHeight: 1 }}
            >
              🤖
              <AnimatePresence>
                {hasUnread && (
                  <Motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "#ef4444",
                      border: "2.5px solid #0f1117",
                      display: "block",
                    }}
                  />
                )}
              </AnimatePresence>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.button>
    </>
  );
}
