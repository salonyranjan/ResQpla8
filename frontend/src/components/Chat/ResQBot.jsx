import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineArrowPath,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ─── Constants ──────────────────────────────────────────────── */
const SYSTEM_INSTRUCTION = `You are ResQBot, the AI assistant for ResQPlate — a food rescue platform connecting food donors with NGOs to reduce waste and fight hunger.

Your role:
- Help users donate surplus food and navigate donation listings
- Help NGOs find available food donations nearby
- Explain how ResQPlate works (listing food, claiming donations, logistics)
- Answer questions about food safety, storage, and handling
- Provide eco-conscious advice on reducing food waste

Tone: Warm, concise, professional. Use short paragraphs. Never use bullet lists with more than 4 items. If a question is outside food rescue, politely redirect to ResQPlate topics.`;

const QUICK_REPLIES = [
  "How do I donate food?",
  "Find NGOs near me",
  "Food safety tips",
  "Track my donation",
];

/* ─── Gemini client (module-level singleton) ─────────────────── */
let geminiModel = null;
try {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (key) {
    const genAI = new GoogleGenerativeAI(key);
    geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });
  }
} catch (e) {
  console.error("Gemini init failed:", e);
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}

/* ─── Leaf Icon ──────────────────────────────────────────────── */
function LeafIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

/* ─── Typing Indicator ───────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Message Bubble ─────────────────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <LeafIcon size={14} className="text-emerald-600" />
        </div>
      )}

      <div
        className={`flex flex-col gap-0.5 max-w-[78%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-emerald-600 text-white rounded-tr-sm shadow-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
          }`}
          dangerouslySetInnerHTML={
            isUser ? undefined : { __html: parseMarkdown(msg.text) }
          }
        >
          {isUser ? msg.text : undefined}
        </div>
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(msg.id)}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ResQBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatHistoryRef = useRef([]);

  /* Auto-scroll */
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isMinimized]);

  /* Greeting on open */
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setHasUnread(false);
      chatHistoryRef.current = [];
      const name = user?.name?.split(" ")[0];
      const greeting = name
        ? `Hello **${name}**! 👋 I'm ResQBot, your food rescue assistant. How can I help you today?`
        : "Hello! 👋 I'm **ResQBot**, your food rescue assistant. How can I help you today?";
      setMessages([{ id: Date.now(), text: greeting, sender: "bot" }]);
    }
  }, [isOpen, user]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text ?? inputValue).trim();
      if (!messageText || isTyping) return;

      const userMsg = { id: Date.now(), text: messageText, sender: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      chatHistoryRef.current.push({
        role: "user",
        parts: [{ text: messageText }],
      });

      try {
        if (!geminiModel) throw new Error("Model not initialized");

        const history = chatHistoryRef.current.slice(0, -1);
        const chat = geminiModel.startChat({ history });
        const result = await chat.sendMessage(messageText);
        const responseText = result.response.text();

        chatHistoryRef.current.push({
          role: "model",
          parts: [{ text: responseText }],
        });

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: responseText, sender: "bot" },
        ]);

        if (!isOpen || isMinimized) setHasUnread(true);
      } catch (error) {
        console.error("Gemini error:", error);
        chatHistoryRef.current.pop();

        let errText =
          "I'm having trouble connecting right now. Please try again in a moment. 🌿";
        if (error.message?.includes("API_KEY"))
          errText = "API key error. Please check your configuration.";
        if (error.message?.includes("quota"))
          errText = "Rate limit reached. Please wait a moment and try again.";

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: errText, sender: "bot" },
        ]);
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
    chatHistoryRef.current = [];
    const name = user?.name?.split(" ")[0];
    const greeting = name
      ? `Chat reset. Hello again **${name}**! How can I help you?`
      : "Chat reset. How can I help you?";
    setMessages([{ id: Date.now(), text: greeting, sender: "bot" }]);
  };

  const toggleOpen = () => {
    if (isOpen && !isMinimized) {
      setIsOpen(false);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
      setHasUnread(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="fixed bottom-[88px] right-5 w-[360px] sm:w-[380px] bg-white rounded-2xl overflow-hidden z-50"
            style={{
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            {/* Header */}
            <div
              className="relative flex items-center justify-between px-4 py-3"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <LeafIcon size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    ResQBot
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-emerald-200 text-[10px]">
                      Online · AI Assistant
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset chat"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
                >
                  <HiOutlineArrowPath className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  title={isMinimized ? "Expand" : "Minimize"}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
                >
                  <HiOutlineChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMinimized ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body — collapses when minimized */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Messages */}
                  <div
                    className="h-[340px] overflow-y-auto px-3.5 py-3 space-y-3 scroll-smooth"
                    style={{ background: "#f8faf9" }}
                  >
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}

                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="flex gap-2 items-end"
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                            <LeafIcon size={14} className="text-emerald-600" />
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                            <TypingDots />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Replies — shown only at conversation start */}
                  {messages.length <= 1 && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="px-3.5 pb-2 pt-2 flex gap-1.5 flex-wrap border-t border-gray-100"
                      style={{ background: "#f8faf9" }}
                    >
                      {QUICK_REPLIES.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => sendMessage(qr)}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all whitespace-nowrap font-medium"
                        >
                          {qr}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Input Area */}
                  <div
                    className={`flex items-end gap-2 px-3 py-3 border-t transition-colors duration-150 ${
                      inputFocused ? "border-emerald-200" : "border-gray-100"
                    } bg-white`}
                  >
                    <div className="relative flex-1">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height =
                            Math.min(e.target.scrollHeight, 96) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder="Ask ResQBot anything…"
                        rows={1}
                        disabled={isTyping}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                        style={{ maxHeight: "96px", lineHeight: "1.5" }}
                      />
                    </div>

                    <button
                      onClick={() => sendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background:
                          inputValue.trim() && !isTyping
                            ? "linear-gradient(135deg, #059669, #047857)"
                            : "#e5e7eb",
                      }}
                    >
                      <HiOutlinePaperAirplane
                        className={`w-4 h-4 transition-colors ${
                          inputValue.trim() && !isTyping
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-3.5 pb-2.5 flex items-center justify-center gap-1">
                    <LeafIcon size={10} className="text-gray-300" />
                    <span className="text-[10px] text-gray-300">
                      Powered by ResQPlate AI · Gemini
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleOpen}
        title="ResQBot"
        className="fixed bottom-5 right-5 w-14 h-14 rounded-2xl flex items-center justify-center z-50"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          boxShadow: "0 4px 20px rgba(5, 150, 105, 0.45)",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen && !isMinimized ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <HiOutlineXMark className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <HiOutlineChatBubbleLeftEllipsis className="w-6 h-6 text-white" />
              <AnimatePresence>
                {hasUnread && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}