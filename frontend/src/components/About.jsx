import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion(Link);

/* ═══════════════════════════════════════════════════
   NAV LINKS
═══════════════════════════════════════════════════ */
const ABOUT_NAV_LINKS = [
  { label: "About",        href: "#hero",         emoji: "✦" },
  { label: "Mission",      href: "#mission",       emoji: "🎯" },
  { label: "How It Works", href: "#how-it-works",  emoji: "⚙️" },
  { label: "Impact",       href: "#impact",        emoji: "📊" },
  { label: "Values",       href: "#values",        emoji: "💚" },
];

/* ═══════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════ */
const GLOBAL_CSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: ${dark ? "#070f09" : "#f7f2e8"};
    color: ${dark ? "#e8f5ec" : "#111c15"};
    font-family: 'Cabinet Grotesk', sans-serif;
    transition: background 0.45s ease, color 0.45s ease;
    overflow-x: hidden;
  }

  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; }

  /* ── Keyframes ── */
  @keyframes rqNavShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes rqAurora {
    0%,100% { transform: translateX(-30%) scaleY(1); opacity:0.18; }
    33%      { transform: translateX(10%)  scaleY(1.4); opacity:0.26; }
    66%      { transform: translateX(-10%) scaleY(0.8); opacity:0.14; }
  }
  @keyframes rqOrb {
    0%,100% { transform: translate(-50%,-50%) scale(1);   opacity:0.22; }
    50%      { transform: translate(-50%,-50%) scale(1.3); opacity:0.34; }
  }
  @keyframes rqSeedFloat {
    0%   { transform: translateY(0px)  rotate(0deg)   scale(1);   opacity:0; }
    15%  { opacity:0.55; }
    85%  { opacity:0.35; }
    100% { transform: translateY(-38px) rotate(180deg) scale(0.4); opacity:0; }
  }
  @keyframes blob-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(50px,40px) scale(1.12); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(1.5); }
  }
  @keyframes underline-reveal { to { transform: scaleX(1); } }
  @keyframes scroll-line {
    0%   { transform: scaleY(0.4) translateY(-30px); opacity:0; }
    50%  { transform: scaleY(1)   translateY(0);     opacity:1; }
    100% { transform: scaleY(0.4) translateY(30px);  opacity:0; }
  }
  @keyframes shimmer-bg {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes drawer-shimmer {
    0%   { opacity: 0; transform: translateX(-8px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  /* ── Reveal ── */
  .rv {
    opacity: 0;
    transform: translateY(44px);
    transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1),
                transform 0.8s cubic-bezier(0.22,1,0.36,1);
  }
  .rv.in { opacity: 1; transform: translateY(0); }
  .rv-d1 { transition-delay: 0.10s; }
  .rv-d2 { transition-delay: 0.22s; }
  .rv-d3 { transition-delay: 0.34s; }
  .rv-d4 { transition-delay: 0.46s; }
  .rv-d5 { transition-delay: 0.58s; }

  /* ── Nav: desktop links always shown, burger ONLY on mobile ── */
  .ab-nav-links-desktop { display: flex !important; }
  .ab-nav-burger         { display: none !important; }

  @media (max-width: 860px) {
    .ab-nav-links-desktop { display: none !important; }
    .ab-nav-burger         { display: flex !important; }
  }

  /* ── Mobile drawer overlay ── */
  .ab-drawer-overlay {
    position: fixed; inset: 0; z-index: 998;
    background: ${dark ? "rgba(4,8,5,0.72)" : "rgba(10,22,8,0.55)"};
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  /* ── Mobile drawer panel ── */
  .ab-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 999;
    width: min(340px, 88vw);
    background: ${dark
      ? "linear-gradient(160deg, #080f0a 0%, #0c1710 60%, #081209 100%)"
      : "linear-gradient(160deg, #f2ede0 0%, #e8e3d5 60%, #ede8d8 100%)"};
    border-left: 1px solid ${dark ? "rgba(82,183,136,0.18)" : "rgba(26,74,46,0.16)"};
    display: flex; flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  .ab-drawer-head {
    display: flex; align-items: center; justify-content: flex-end;
    padding: 22px 24px 20px;
    border-bottom: 1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.10)"};
  }

  .ab-drawer-close {
    width: 38px; height: 38px; border-radius: 12px;
    border: 1px solid ${dark ? "rgba(82,183,136,0.18)" : "rgba(26,74,46,0.15)"};
    background: ${dark ? "rgba(82,183,136,0.06)" : "rgba(26,74,46,0.05)"};
    display: flex; align-items: center; justify-content: center;
    color: ${dark ? "#52b788" : "#2d6a4f"};
    font-size: 18px; cursor: pointer;
    transition: background 0.22s, transform 0.22s;
  }
  .ab-drawer-close:hover {
    background: ${dark ? "rgba(82,183,136,0.14)" : "rgba(26,74,46,0.10)"};
    transform: rotate(90deg);
  }

  .ab-drawer-nav {
    flex: 1; padding: 20px 16px;
    display: flex; flex-direction: column; gap: 6px;
    overflow-y: auto;
  }

  .ab-drawer-link {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 16px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 15px; font-weight: 500;
    color: ${dark ? "rgba(110,231,183,0.65)" : "rgba(26,74,46,0.65)"};
    text-decoration: none; cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position: relative; overflow: hidden;
  }
  .ab-drawer-link:hover, .ab-drawer-link.active {
    background: ${dark ? "rgba(82,183,136,0.09)" : "rgba(26,74,46,0.07)"};
    border-color: ${dark ? "rgba(82,183,136,0.20)" : "rgba(26,74,46,0.16)"};
    color: ${dark ? "#95d5b2" : "#1a4a2e"};
    transform: translateX(4px);
  }
  .ab-drawer-link.active {
    background: ${dark ? "rgba(82,183,136,0.13)" : "rgba(26,74,46,0.09)"};
    border-color: ${dark ? "rgba(82,183,136,0.28)" : "rgba(26,74,46,0.22)"};
    color: ${dark ? "#52b788" : "#1a4a2e"};
  }
  .ab-drawer-link-emoji {
    font-size: 18px; width: 36px; height: 36px;
    border-radius: 10px;
    background: ${dark ? "rgba(82,183,136,0.08)" : "rgba(26,74,46,0.06)"};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.25s;
  }
  .ab-drawer-link:hover .ab-drawer-link-emoji,
  .ab-drawer-link.active .ab-drawer-link-emoji {
    background: ${dark ? "rgba(82,183,136,0.16)" : "rgba(26,74,46,0.12)"};
  }
  .ab-drawer-link-arrow {
    margin-left: auto;
    font-size: 14px;
    color: ${dark ? "rgba(82,183,136,0.30)" : "rgba(26,74,46,0.30)"};
    transition: transform 0.25s, color 0.25s;
  }
  .ab-drawer-link:hover .ab-drawer-link-arrow,
  .ab-drawer-link.active .ab-drawer-link-arrow {
    transform: translateX(3px);
    color: ${dark ? "rgba(82,183,136,0.70)" : "rgba(26,74,46,0.60)"};
  }
  .ab-drawer-link-active-bar {
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: #52b788;
  }

  .ab-drawer-divider {
    height: 1px;
    background: ${dark ? "rgba(82,183,136,0.09)" : "rgba(26,74,46,0.09)"};
    margin: 8px 16px;
  }

  .ab-drawer-foot {
    padding: 20px 24px 32px;
    border-top: 1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.10)"};
    display: flex; flex-direction: column; gap: 12px;
  }

  .ab-drawer-cta-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: #52b788; color: #070f09;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: 0.02em;
    padding: 14px 24px; border-radius: 100px; border: none;
    text-decoration: none;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    box-shadow: 0 4px 20px rgba(82,183,136,0.35);
  }
  .ab-drawer-cta-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 32px rgba(82,183,136,0.50);
  }

  .ab-drawer-cta-ghost {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent;
    border: 1px solid ${dark ? "rgba(82,183,136,0.20)" : "rgba(26,74,46,0.18)"};
    color: ${dark ? "rgba(149,213,178,0.75)" : "rgba(26,74,46,0.70)"};
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 13px 24px; border-radius: 100px;
    text-decoration: none;
    transition: background 0.25s, border-color 0.25s;
  }
  .ab-drawer-cta-ghost:hover {
    background: ${dark ? "rgba(82,183,136,0.08)" : "rgba(26,74,46,0.06)"};
    border-color: ${dark ? "rgba(82,183,136,0.35)" : "rgba(26,74,46,0.28)"};
  }

  .ab-drawer-theme-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0 0;
  }
  .ab-drawer-theme-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${dark ? "rgba(110,231,183,0.35)" : "rgba(74,94,82,0.40)"};
    font-family: 'DM Mono', monospace;
  }

  /* ── Burger button — mobile only, NEVER shown on desktop ── */
  .ab-burger-btn {
    width: 44px; height: 44px; border-radius: 14px;
    border: 1px solid ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"};
    background: ${dark ? "rgba(82,183,136,0.06)" : "rgba(26,74,46,0.05)"};
    display: none;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 5px; cursor: pointer;
    transition: background 0.25s, border-color 0.25s;
  }
  @media (max-width: 860px) {
    .ab-burger-btn { display: flex !important; }
  }
  .ab-burger-btn:hover {
    background: ${dark ? "rgba(82,183,136,0.12)" : "rgba(26,74,46,0.10)"};
    border-color: ${dark ? "rgba(82,183,136,0.35)" : "rgba(26,74,46,0.28)"};
  }
  .ab-burger-line {
    display: block; width: 18px; height: 1.5px; border-radius: 2px;
    background: ${dark ? "#52b788" : "#2d6a4f"};
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s, width 0.3s;
  }
  .ab-burger-btn.open .ab-burger-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .ab-burger-btn.open .ab-burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ab-burger-btn.open .ab-burger-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ── Hero ── */
  .ab-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 100px 24px 80px;
    background: ${dark ? "#060b04" : "#0a1406"};
    position: relative;
    overflow: hidden;
  }
  .ab-hero-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px; opacity: 0.028;
  }
  .ab-hero-mesh {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(82,183,136,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(82,183,136,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%);
  }
  .ab-hero-glow {
    position: absolute; border-radius: 50%; filter: blur(100px);
    pointer-events: none; animation: blob-drift 18s ease-in-out infinite alternate;
  }
  .ab-glow-a {
    width: 700px; height: 700px;
    background: ${dark ? "rgba(45,106,79,0.35)" : "rgba(74,156,26,0.35)"};
    top: -200px; left: -200px; animation-duration: 22s;
  }
  .ab-glow-b {
    width: 500px; height: 500px;
    background: ${dark ? "rgba(82,183,136,0.18)" : "rgba(30,155,130,0.22)"};
    bottom: -100px; right: -100px;
    animation-duration: 16s; animation-direction: alternate-reverse;
  }
  .ab-glow-c {
    width: 300px; height: 300px;
    background: ${dark ? "rgba(245,158,11,0.12)" : "rgba(224,154,46,0.18)"};
    top: 55%; left: 52%; animation-duration: 12s;
  }

  .ab-hero-content { position: relative; z-index: 2; max-width: 860px; }

  .ab-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(82,183,136,0.10); border: 1px solid rgba(82,183,136,0.22);
    border-radius: 100px; padding: 6px 18px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: #52b788; margin-bottom: 28px;
    font-family: 'DM Mono', monospace;
  }
  .ab-pill-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #52b788;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .ab-h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(52px, 9vw, 104px);
    font-weight: 900; line-height: 0.95; color: #edf5e1;
    letter-spacing: -0.03em; margin-bottom: 6px;
  }
  .ab-h1-em {
    font-style: italic; color: #52b788; position: relative;
  }
  .ab-h1-em::after {
    content: ''; position: absolute; bottom: 6px; left: 0; right: 0;
    height: 4px; border-radius: 2px; background: #f59e0b;
    transform: scaleX(0); transform-origin: left;
    animation: underline-reveal 1s 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .ab-hero-sub {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: clamp(17px, 2.5vw, 24px); font-weight: 400;
    color: rgba(200,230,170,0.7); max-width: 580px;
    margin: 28px auto 0; line-height: 1.65;
  }

  .ab-stats {
    display: flex; gap: 0; justify-content: center; flex-wrap: wrap;
    margin-top: 56px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(82,183,136,0.14);
    border-radius: 20px; padding: 24px 32px;
    backdrop-filter: blur(12px);
  }
  .ab-stat {
    padding: 0 36px; text-align: center; position: relative;
  }
  .ab-stat + .ab-stat::before {
    content: ''; position: absolute; left: 0; top: 10%; bottom: 10%;
    width: 1px; background: rgba(82,183,136,0.14);
  }
  .ab-stat-n {
    font-family: 'Fraunces', serif; font-size: 44px; font-weight: 900;
    color: #52b788; line-height: 1;
  }
  .ab-stat-l {
    font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: rgba(149,213,178,0.5); margin-top: 8px;
    font-family: 'DM Mono', monospace;
  }

  @media (max-width: 600px) {
    .ab-stat { padding: 12px 20px; }
  }

  .ab-scroll-cue {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 2; display: flex; flex-direction: column; align-items: center;
    gap: 10px; color: rgba(149,213,178,0.4);
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    font-family: 'DM Mono', monospace;
  }
  .ab-scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, rgba(82,183,136,0.5), transparent);
    animation: scroll-line 2.4s ease-in-out infinite;
  }

  .ab-sep {
    height: 1px;
    background: linear-gradient(90deg, transparent,
      ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"},
      transparent);
  }

  .ab-section { padding: 120px 24px; }

  .ab-tag {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: #f59e0b; margin-bottom: 18px; position: relative;
    padding-left: 20px; font-family: 'DM Mono', monospace;
  }
  .ab-tag::before {
    content: ''; position: absolute; left: 0; top: 50%;
    width: 12px; height: 2px; background: #f59e0b; border-radius: 1px;
  }

  .ab-h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(30px, 4.5vw, 56px); font-weight: 900;
    line-height: 1.05; color: ${dark ? "#e8f5ec" : "#111c15"};
    letter-spacing: -0.03em; margin-bottom: 24px;
  }
  .ab-h2 em { font-style: italic; color: #52b788; }
  .ab-p {
    font-size: 16px; line-height: 1.85;
    color: ${dark ? "#6ee7b7" : "#4a5e52"}; margin-bottom: 18px;
  }

  /* ── Origin ── */
  .ab-origin { background: ${dark ? "#070f09" : "#f7f2e8"}; }
  .ab-origin-inner {
    max-width: 1120px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center;
  }
  @media (max-width: 840px) { .ab-origin-inner { grid-template-columns: 1fr; gap: 48px; } }

  .ab-why-card {
    background: ${dark ? "#111d14" : "#ffffff"};
    border: 1px solid ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"};
    border-radius: 28px; padding: 44px 40px; position: relative; overflow: hidden;
  }
  .ab-why-card::before {
    content: ''; position: absolute; top: -80px; right: -80px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, #52b788 0%, transparent 70%);
    opacity: 0.07; pointer-events: none;
  }
  .ab-why-title {
    font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700;
    color: ${dark ? "#e8f5ec" : "#111c15"}; margin-bottom: 28px;
  }
  .ab-why-item {
    display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px;
    font-size: 14.5px; color: ${dark ? "#6ee7b7" : "#4a5e52"}; line-height: 1.6;
  }
  .ab-why-check {
    width: 24px; height: 24px; border-radius: 50%; background: #2d6a4f;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #edf5e1; font-weight: 700; flex-shrink: 0; margin-top: 1px;
  }

  /* ── How it works ── */
  .ab-how { background: ${dark ? "#0c1710" : "#ede8db"}; position: relative; overflow: hidden; }
  .ab-how-inner { max-width: 1120px; margin: 0 auto; }
  .ab-how-header { text-align: center; max-width: 640px; margin: 0 auto 80px; }

  .ab-timeline {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative;
  }
  .ab-timeline::before {
    content: ''; position: absolute; top: 52px; left: 12.5%; right: 12.5%; height: 2px;
    background: linear-gradient(90deg, transparent, #52b788, #f59e0b, #95d5b2, transparent);
    opacity: 0.22;
  }
  @media (max-width: 760px) { .ab-timeline { grid-template-columns: 1fr 1fr; } .ab-timeline::before { display: none; } }
  @media (max-width: 440px)  { .ab-timeline { grid-template-columns: 1fr; } }

  .ab-step {
    background: ${dark ? "#0f1a12" : "#ffffff"};
    border: 1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)"};
    border-radius: 22px; padding: 32px 24px; text-align: center; position: relative;
    transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.3s ease;
    cursor: pointer;
  }
  .ab-step:hover {
    transform: translateY(-10px);
    box-shadow: 0 28px 64px ${dark ? "rgba(0,0,0,0.35)" : "rgba(26,74,46,0.14)"};
    border-color: ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"};
  }
  .ab-step-icon {
    width: 56px; height: 56px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
    margin: 0 auto 20px;
    border: 1px solid ${dark ? "rgba(82,183,136,0.20)" : "rgba(26,74,46,0.16)"};
  }
  .ab-step-title {
    font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700;
    color: ${dark ? "#e8f5ec" : "#111c15"}; margin-bottom: 12px;
  }
  .ab-step-body { font-size: 13px; line-height: 1.75; color: ${dark ? "#6ee7b7" : "#4a5e52"}; }

  .ab-step::after {
    content: ''; position: absolute; top: 0; left: 20px; right: 20px;
    height: 3px; border-radius: 0 0 3px 3px;
    transition: height 0.3s ease;
  }
  .ab-step:hover::after { height: 5px; }
  .step-green::after { background: #52b788; }
  .step-teal::after  { background: #1fb8a0; }
  .step-amber::after { background: #f59e0b; }
  .step-leaf::after  { background: #2d6a4f; }

  /* ── Impact ── */
  .ab-impact { background: ${dark ? "#070f09" : "#f7f2e8"}; position: relative; overflow: hidden; }
  .ab-impact-watermark {
    position: absolute; font-family: 'Fraunces', serif; font-size: 340px;
    font-weight: 900; color: #52b788; opacity: 0.022;
    top: -60px; left: -20px; user-select: none; pointer-events: none; line-height: 1;
  }
  .ab-impact-inner {
    max-width: 1120px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  @media (max-width: 760px) { .ab-impact-inner { grid-template-columns: 1fr; gap: 48px; } }

  .ab-impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ab-impact-card {
    background: ${dark ? "#0f1a12" : "#ffffff"};
    border: 1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)"};
    border-radius: 22px; padding: 32px 24px; position: relative; overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease;
  }
  .ab-impact-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"};
  }
  .ab-impact-glow {
    position: absolute; top: -30px; right: -30px; width: 80px; height: 80px;
    border-radius: 50%; opacity: 0.18; pointer-events: none; transition: opacity 0.3s;
  }
  .ab-impact-card:hover .ab-impact-glow { opacity: 0.36; }
  .ab-impact-icon { font-size: 28px; display: block; margin-bottom: 16px; }
  .ab-impact-num {
    font-family: 'Fraunces', serif; font-size: 40px; font-weight: 900;
    line-height: 1; margin-bottom: 8px;
  }
  .ab-impact-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${dark ? "rgba(110,231,183,0.4)" : "rgba(74,94,82,0.45)"};
    font-family: 'DM Mono', monospace;
  }

  /* ── Values ── */
  .ab-values { background: ${dark ? "#0c1710" : "#ede8db"}; }
  .ab-values-header { text-align: center; max-width: 600px; margin: 0 auto 72px; }
  .ab-values-inner { max-width: 1120px; margin: 0 auto; }
  .ab-values-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
  }
  @media (max-width: 840px) { .ab-values-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 440px)  { .ab-values-grid { grid-template-columns: 1fr; } }

  .ab-value-card {
    background: ${dark ? "#111d14" : "#ffffff"};
    border: 1px solid ${dark ? "rgba(82,183,136,0.10)" : "rgba(26,74,46,0.09)"};
    border-radius: 24px; padding: 38px 28px; position: relative; overflow: hidden;
    transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
  }
  .ab-value-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 64px ${dark ? "rgba(0,0,0,0.28)" : "rgba(26,74,46,0.12)"};
  }
  .ab-value-card::after {
    content: ''; position: absolute; bottom: -50px; right: -50px;
    width: 130px; height: 130px; border-radius: 50%; background: #52b788;
    opacity: 0.06; transition: transform 0.45s ease, opacity 0.35s ease;
  }
  .ab-value-card:hover::after { transform: scale(1.6); opacity: 0.13; }
  .ab-value-emoji { font-size: 36px; display: block; margin-bottom: 20px; }
  .ab-value-title {
    font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700;
    color: #52b788; margin-bottom: 12px;
  }
  .ab-value-body { font-size: 13.5px; line-height: 1.75; color: ${dark ? "#6ee7b7" : "#4a5e52"}; }

  /* ── Quote ── */
  .ab-quote {
    background: ${dark ? "#070f09" : "#f7f2e8"};
    padding: 100px 24px; position: relative; overflow: hidden;
  }
  .ab-quote-bg {
    position: absolute; font-family: 'Fraunces', serif; font-size: 520px;
    font-weight: 900; color: #52b788; opacity: 0.022;
    top: -120px; left: -30px; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .ab-quote-inner { max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
  .ab-quote-mark {
    font-family: 'Fraunces', serif; font-size: 80px; font-weight: 900;
    color: #52b788; line-height: 0.6; display: block; margin-bottom: 32px; opacity: 0.6;
  }
  .ab-quote-text {
    font-family: 'Fraunces', serif;
    font-size: clamp(22px, 3.5vw, 38px); font-weight: 700; font-style: italic;
    line-height: 1.45; color: ${dark ? "#e8f5ec" : "#111c15"};
    letter-spacing: -0.01em; margin-bottom: 40px;
  }
  .ab-quote-text em { color: #52b788; font-style: normal; }
  .ab-quote-attr { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .ab-quote-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #2d6a4f, #52b788);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    border: 2px solid ${dark ? "rgba(82,183,136,0.22)" : "rgba(26,74,46,0.18)"};
  }
  .ab-quote-name { font-size: 14px; font-weight: 600; color: ${dark ? "#e8f5ec" : "#111c15"}; }
  .ab-quote-role { font-size: 12px; color: ${dark ? "rgba(110,231,183,0.4)" : "rgba(74,94,82,0.45)"}; margin-top: 2px; }

  /* ── CTA ── */
  .ab-cta {
    background: linear-gradient(160deg, #0d2206 0%, #0a1a04 50%, #061008 100%);
    padding: 120px 24px; text-align: center; position: relative; overflow: hidden;
  }
  .ab-cta-glow {
    position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(45,106,79,0.28) 0%, transparent 65%);
    pointer-events: none;
  }
  .ab-cta-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(82,183,136,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(82,183,136,0.05) 1px, transparent 1px);
    background-size: 50px 50px; pointer-events: none;
    mask-image: radial-gradient(ellipse at 50% 0%, black 0%, transparent 60%);
  }
  .ab-cta-inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
  .ab-cta-h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(36px, 6vw, 72px); font-weight: 900;
    line-height: 1.0; color: #edf5e1; letter-spacing: -0.03em; margin-bottom: 20px;
  }
  .ab-cta-h2 em { font-style: italic; color: #52b788; }
  .ab-cta-sub {
    font-size: 17px; color: rgba(200,230,170,0.6); line-height: 1.75;
    margin-bottom: 52px; max-width: 520px; margin-left: auto; margin-right: auto;
  }
  .ab-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  .ab-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #52b788; color: #070f09;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.02em; padding: 17px 40px; border-radius: 100px;
    border: none; cursor: pointer; text-decoration: none;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, background 0.25s ease;
    box-shadow: 0 6px 32px rgba(82,183,136,0.40);
  }
  .ab-btn-primary:hover {
    transform: translateY(-5px) scale(1.04);
    box-shadow: 0 16px 48px rgba(82,183,136,0.55); background: #95d5b2;
  }
  .ab-btn-primary .arr { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .ab-btn-primary:hover .arr { transform: translateX(5px); }

  .ab-btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.06); color: rgba(200,230,170,0.85);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 600;
    padding: 17px 36px; border-radius: 100px;
    border: 1px solid rgba(82,183,136,0.22);
    cursor: pointer; text-decoration: none;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease, border-color 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .ab-btn-ghost:hover {
    transform: translateY(-4px);
    background: rgba(82,183,136,0.10); border-color: rgba(82,183,136,0.40);
  }

  .ab-partners { margin-top: 72px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .ab-partners-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(149,213,178,0.35); font-family: 'DM Mono', monospace;
  }
  .ab-partners-row { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
  .ab-partner-pill {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(82,183,136,0.14);
    border-radius: 100px; padding: 8px 20px; font-size: 12.5px; font-weight: 600;
    color: rgba(200,230,170,0.40); letter-spacing: 0.06em;
    font-family: 'Cabinet Grotesk', sans-serif;
  }
  .ab-cta-foot { margin-top: 60px; font-size: 11px; color: rgba(149,213,178,0.25); letter-spacing: 0.08em; font-family: 'DM Mono', monospace; }
`;

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════ */
function Counter({ to, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let current = 0;
      const steps = 70;
      const increment = to / steps;
      const interval = 1800 / steps;
      const timer = setInterval(() => {
        current = Math.min(current + increment, to);
        setVal(Math.round(current));
        if (current >= to) clearInterval(timer);
      }, interval);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.10, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════
   MAGNETIC NAV LINK (desktop only)
═══════════════════════════════════════════════════ */
const MagneticNavLink = ({ children, href, isActive, onClick, dark }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.28, y: (e.clientY - cy) * 0.28 });
  };
  const handleMouseLeave = () => { setPos({ x: 0, y: 0 }); setHovered(false); };

  const inner = (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.4 }}
      style={{
        position: "relative", border: "none", background: "transparent",
        padding: "10px 18px", cursor: "pointer", display: "flex",
        alignItems: "center", gap: 6, borderRadius: 14,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontSize: 13, fontWeight: isActive ? 600 : 400,
        color: isActive
          ? (dark ? "#95d5b2" : "#1a4a2e")
          : (dark ? "rgba(110,231,183,0.5)" : "rgba(74,94,82,0.6)"),
        letterSpacing: "0.02em",
        transition: "color 0.25s",
        overflow: "visible",
      }}
    >
      <AnimatePresence>
        {(isActive || hovered) && (
          <motion.div
            key="glow"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28 }}
            style={{
              position: "absolute", inset: 0, borderRadius: 14,
              background: isActive
                ? (dark
                  ? "linear-gradient(135deg,rgba(45,106,79,0.55),rgba(82,183,136,0.18))"
                  : "linear-gradient(135deg,rgba(45,106,79,0.12),rgba(82,183,136,0.08))")
                : (dark ? "rgba(82,183,136,0.07)" : "rgba(26,74,46,0.05)"),
              border: isActive
                ? `1px solid ${dark ? "rgba(82,183,136,0.28)" : "rgba(26,74,46,0.18)"}`
                : "1px solid transparent",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <motion.span
        animate={isActive
          ? { scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }
          : { scale: 1, opacity: hovered ? 0.6 : 0 }}
        transition={isActive ? { duration: 2.4, repeat: Infinity } : { duration: 0.2 }}
        style={{
          width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
          background: dark ? "#52b788" : "#2d6a4f",
          display: "inline-block",
          boxShadow: isActive && dark ? "0 0 8px #52b788" : "none",
        }}
      />

      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>

      {isActive && (
        <motion.div
          layoutId="ab-nav-shimmer-line"
          style={{
            position: "absolute", bottom: 4, left: 18, right: 18, height: 1.5, borderRadius: 2,
            background: dark
              ? "linear-gradient(90deg, transparent, #52b788, #95d5b2, #52b788, transparent)"
              : "linear-gradient(90deg, transparent, #2d6a4f, #52b788, #2d6a4f, transparent)",
            backgroundSize: "200% 100%",
            animation: "rqNavShimmer 2.2s linear infinite",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </motion.button>
  );

  if (href.startsWith("#")) return <a href={href} style={{ textDecoration: "none" }}>{inner}</a>;
  return <Link to={href} style={{ textDecoration: "none" }}>{inner}</Link>;
};

/* ═══════════════════════════════════════════════════
   NAV FIREFLY
═══════════════════════════════════════════════════ */
const NavFirefly = ({ dark, index }) => {
  const x = 15 + index * 18 + (index * 7 % 8);
  return (
    <motion.div
      style={{
        position: "absolute", left: `${x}%`, top: "50%",
        width: 3, height: 3, borderRadius: "50%",
        background: dark ? "#52b788" : "#2d6a4f",
        pointerEvents: "none",
        boxShadow: dark ? "0 0 6px #52b788" : "0 0 4px #2d6a4f",
      }}
      animate={{ y: [-8, 8, -8], x: [-4, 4, -4], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 3 + index * 0.7, repeat: Infinity, delay: index * 0.9, ease: "easeInOut" }}
    />
  );
};

/* ═══════════════════════════════════════════════════
   ORBITAL DARK MODE TOGGLE
═══════════════════════════════════════════════════ */
const DarkToggle = ({ dark, toggleDark }) => (
  <motion.button
    onClick={toggleDark}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92, rotate: 15 }}
    style={{
      position: "relative", width: 44, height: 44, borderRadius: "50%",
      border: "none", background: "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, overflow: "visible",
    }}
  >
    <motion.div
      animate={{ rotate: dark ? 0 : 180 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `1.5px solid ${dark ? "rgba(82,183,136,0.35)" : "rgba(26,74,46,0.25)"}`,
      }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, borderRadius: "50%" }}
      >
        <div style={{
          position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
          width: 6, height: 6, borderRadius: "50%",
          background: dark ? "#f59e0b" : "#2d6a4f",
          boxShadow: dark ? "0 0 8px #f59e0b, 0 0 16px rgba(245,158,11,0.5)" : "0 0 6px #2d6a4f",
        }} />
      </motion.div>
    </motion.div>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: dark
        ? "linear-gradient(135deg, rgba(15,26,18,0.9), rgba(30,50,35,0.8))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(230,240,232,0.8))",
      border: `1px solid ${dark ? "rgba(82,183,136,0.2)" : "rgba(26,74,46,0.15)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: dark
        ? "inset 0 1px 0 rgba(82,183,136,0.15), 0 2px 8px rgba(0,0,0,0.4)"
        : "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(26,74,46,0.12)",
    }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={{ rotate: -120, opacity: 0, scale: 0.3 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 120, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {dark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.5" fill="#f59e0b" opacity="0.9"/>
              <circle cx="12" cy="12" r="4.5" stroke="#fbbf24" strokeWidth="1.5" fill="none"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="#2d6a4f" opacity="0.25" stroke="#2d6a4f" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  </motion.button>
);

/* ═══════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════ */
const MobileDrawer = ({ dark, toggleDark, activeIdx, setActiveIdx, open, onClose }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="ab-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className="ab-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
          >
            {/* Header — close button only, no logo/name */}
            <div className="ab-drawer-head">
              <button className="ab-drawer-close" onClick={onClose} aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav className="ab-drawer-nav" aria-label="Mobile navigation">
              {ABOUT_NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={`ab-drawer-link${activeIdx === i ? " active" : ""}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 340, damping: 28 }}
                  onClick={() => { setActiveIdx(i); onClose(); }}
                >
                  {activeIdx === i && <div className="ab-drawer-link-active-bar" />}
                  <span className="ab-drawer-link-emoji">{link.emoji}</span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  <span className="ab-drawer-link-arrow">→</span>
                </motion.a>
              ))}

              <div className="ab-drawer-divider" />

              {/* Theme toggle row */}
              <div className="ab-drawer-theme-row">
                <span className="ab-drawer-theme-label">
                  {dark ? "Dark mode" : "Light mode"}
                </span>
                <DarkToggle dark={dark} toggleDark={toggleDark} />
              </div>
            </nav>

            {/* Footer CTAs */}
            <motion.div
              className="ab-drawer-foot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
            >
              <Link to="/register" className="ab-drawer-cta-primary" onClick={onClose}>
                Get Started Free →
              </Link>
              <Link to="/dashboard/search" className="ab-drawer-cta-ghost" onClick={onClose}>
                Browse Listings
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════════════
   ABOUT PAGE SECONDARY NAVBAR
   — No logo/brand name (main navbar handles that)
   — Burger only appears on mobile (≤860px)
═══════════════════════════════════════════════════ */
const AboutNavBar = ({ dark, toggleDark, activeIdx, setActiveIdx }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const h = () => {
      const sy = window.scrollY;
      setScrolled(sy > 20);
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollPct(maxScroll > 0 ? (sy / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Close drawer on resize to desktop */
  useEffect(() => {
    const h = () => { if (window.innerWidth > 860) setDrawerOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const aurora1 = dark ? "rgba(45,106,79,0.35)"   : "rgba(45,106,79,0.18)";
  const aurora2 = dark ? "rgba(82,183,136,0.22)"  : "rgba(82,183,136,0.12)";
  const aurora3 = dark ? "rgba(149,213,178,0.12)" : "rgba(149,213,178,0.08)";

  return (
    <>
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
        style={{
          position: "sticky", top: 0, zIndex: 1000, height: 62,
          background: scrolled
            ? (dark ? "rgba(5,12,7,0.88)" : "rgba(245,240,230,0.88)")
            : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(200%) brightness(1.04)" : "none",
          borderBottom: scrolled
            ? `1px solid ${dark ? "rgba(82,183,136,0.16)" : "rgba(26,74,46,0.12)"}`
            : "1px solid transparent",
          boxShadow: scrolled
            ? (dark
              ? "0 1px 0 rgba(82,183,136,0.06), 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(82,183,136,0.08)"
              : "0 1px 0 rgba(26,74,46,0.05), 0 8px 32px rgba(26,74,46,0.10)")
            : "none",
          transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
          overflow: "visible",
        }}
      >
        {/* Aurora sweep */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          opacity: scrolled ? 1 : 0, transition: "opacity 0.6s",
        }}>
          <div style={{
            position: "absolute", top: "-60%", left: "0%",
            width: "140%", height: "220%", borderRadius: "50%",
            background: `radial-gradient(ellipse 60% 50% at 35% 50%, ${aurora1}, ${aurora2} 40%, ${aurora3} 65%, transparent 80%)`,
            animation: "rqAurora 9s ease-in-out infinite",
            filter: "blur(18px)",
          }} />
        </div>

        {/* Spore seeds */}
        {scrolled && [0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute", left: `${10 + i * 18}%`, bottom: 0,
            width: 4, height: 4, borderRadius: "50%",
            background: dark ? "rgba(82,183,136,0.6)" : "rgba(45,106,79,0.5)",
            pointerEvents: "none",
            animation: `rqSeedFloat ${3.5 + i * 0.8}s ease-in-out infinite ${i * 1.1}s`,
          }} />
        ))}

        {/* Progress filament */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, height: 1.5, borderRadius: 1,
          background: dark
            ? "linear-gradient(90deg, transparent, #2d6a4f, #52b788, #95d5b2, #52b788, #2d6a4f, transparent)"
            : "linear-gradient(90deg, transparent, #1a4a2e, #2d6a4f, #52b788, #2d6a4f, #1a4a2e, transparent)",
          width: `${scrollPct}%`,
          boxShadow: dark ? "0 0 8px #52b788, 0 0 18px rgba(82,183,136,0.4)" : "0 0 6px #2d6a4f",
          transition: "width 0.12s linear",
          opacity: scrolled ? 1 : 0,
        }} />

        {/* Main row — centered nav with right-side controls */}
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "0 20px", height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative", zIndex: 2,
        }}>

          {/* CENTER — desktop nav links (takes natural width, pushed to center via flex) */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div
              className="ab-nav-links-desktop"
              style={{ alignItems: "center", gap: 2 }}
            >
              {ABOUT_NAV_LINKS.map((l, i) => (
                <MagneticNavLink
                  key={l.label}
                  href={l.href}
                  isActive={activeIdx === i}
                  onClick={() => setActiveIdx(i)}
                  dark={dark}
                >
                  {l.label}
                </MagneticNavLink>
              ))}
            </div>
          </div>

          {/* RIGHT — fireflies + dark toggle (desktop) | dark toggle + burger (mobile) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

            {/* Fireflies — desktop only */}
            <div className="ab-nav-links-desktop" style={{
              position: "relative", width: 48, height: 36,
              alignItems: "center", justifyContent: "center",
            }}>
              {[0,1,2].map(i => <NavFirefly key={i} dark={dark} index={i} />)}
            </div>

            {/* Dark toggle — always visible */}
            <DarkToggle dark={dark} toggleDark={toggleDark} />

            {/* Burger — mobile only, hidden on desktop via CSS */}
            <button
              className={`ab-burger-btn${drawerOpen ? " open" : ""}`}
              onClick={() => setDrawerOpen(o => !o)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
            >
              <span className="ab-burger-line" />
              <span className="ab-burger-line" />
              <span className="ab-burger-line" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        dark={dark}
        toggleDark={toggleDark}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
═══════════════════════════════════════════════════ */
export default function About() {
  const [dark, setDark] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const toggleDark = useCallback(() => setDark(d => !d), []);
  useReveal();

  useEffect(() => {
    document.getElementById("ab-global")?.remove();
    const style = document.createElement("style");
    style.id = "ab-global";
    style.textContent = GLOBAL_CSS(dark);
    document.head.appendChild(style);
    return () => document.getElementById("ab-global")?.remove();
  }, [dark]);

  const HOW_STEPS = [
    { emoji: "🍽️", title: "Food Listed",    body: "Restaurants, events & households list surplus food with expiry time and quantity.", color: "step-green", to: "/dashboard/donate" },
    { emoji: "📍", title: "Smart Matched",  body: "Our algorithm instantly notifies the nearest verified NGO or volunteer.", color: "step-teal", to: "/dashboard/ai-matching" },
    { emoji: "🤝", title: "Claim & Pickup", body: "Verified receivers claim the listing and coordinate pickup within minutes.", color: "step-amber", to: "/dashboard/volunteer" },
    { emoji: "❤️", title: "Meal Delivered", body: "Safe, warm food reaches families in need — tracked end-to-end.", color: "step-leaf", to: "/dashboard/track" },
  ];

  const IMPACT = [
    { emoji: "🍽️", num: 12000, suffix: "+",  label: "Meals Rescued",  color: "#52b788", glow: "#52b788" },
    { emoji: "🌿", num: 4200,  suffix: "kg", label: "CO₂ Offset",     color: "#1fb8a0", glow: "#1fb8a0" },
    { emoji: "🤝", num: 340,   suffix: "+",  label: "NGO Partners",   color: "#f59e0b", glow: "#f59e0b" },
    { emoji: "👥", num: 1800,  suffix: "+",  label: "Volunteers",     color: "#52b788", glow: "#52b788" },
  ];

  const VALUES = [
    { emoji: "🛡️", title: "Food Safety",   body: "Only safe, within-expiry food enters our network. Every listing is timestamped and tracked." },
    { emoji: "🔐", title: "Secure Access",  body: "Role-based authentication protects donors, NGOs, and volunteers at every touchpoint." },
    { emoji: "⚖️", title: "Transparency",   body: "A clear, auditable claim-and-pickup workflow means zero ambiguity from listing to plate." },
    { emoji: "🌍", title: "Social Impact",  body: "We build sustainable food systems — not charity, but community-powered change." },
  ];

  const stepIconBg = [
    "rgba(82,183,136,0.12)",
    "rgba(31,184,160,0.12)",
    "rgba(245,158,11,0.12)",
    "rgba(45,106,79,0.12)",
  ];

  return (
    <>
      <AboutNavBar
        dark={dark}
        toggleDark={toggleDark}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />

      {/* ══ HERO ══ */}
      <section className="ab-hero" id="hero">
        <div className="ab-hero-grain" />
        <div className="ab-hero-mesh" />
        <div className="ab-hero-glow ab-glow-a" />
        <div className="ab-hero-glow ab-glow-b" />
        <div className="ab-hero-glow ab-glow-c" />

        <div className="ab-hero-content">
          <div className="ab-pill rv">
            <div className="ab-pill-dot" />
            Our Story
          </div>

          <h1 className="ab-h1 rv rv-d1">
            Rescue Food.<br />
            <span className="ab-h1-em">Restore Hope.</span>
          </h1>

          <p className="ab-hero-sub rv rv-d2">
            Bridging the gap between surplus and need —<br />
            one rescued meal at a time.
          </p>

          <div className="ab-stats rv rv-d3">
            <div className="ab-stat">
              <div className="ab-stat-n"><Counter to={12000} suffix="+" /></div>
              <div className="ab-stat-l">Meals Rescued</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-n"><Counter to={340} suffix="+" /></div>
              <div className="ab-stat-l">NGO Partners</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-n"><Counter to={98} suffix="%" /></div>
              <div className="ab-stat-l">Safe Delivery Rate</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-n"><Counter to={4200} suffix="kg" /></div>
              <div className="ab-stat-l">CO₂ Offset</div>
            </div>
          </div>
        </div>

        <div className="ab-scroll-cue">
          <div className="ab-scroll-line" />
          Scroll
        </div>
      </section>

      <div className="ab-sep" />

      {/* ══ ORIGIN / MISSION ══ */}
      <section className="ab-section ab-origin" id="mission">
        <div className="ab-origin-inner">
          <div>
            <p className="ab-tag rv">Our Mission</p>
            <h2 className="ab-h2 rv rv-d1">
              Technology in service<br />of <em>humanity</em>
            </h2>
            <p className="ab-p rv rv-d2">
              ResQPlate is a precision-built platform that turns food waste into community
              nourishment. We connect restaurants, event organizers, and households with
              verified NGOs and volunteers in real time — no food left behind.
            </p>
            <p className="ab-p rv rv-d3">
              Powered by geolocation, smart matching, and role-based authentication, every
              surplus plate finds its rightful place at someone's table before the clock runs out.
            </p>
          </div>

          <div className="ab-why-card rv rv-d2">
            <h3 className="ab-why-title">Why ResQPlate?</h3>
            {[
              "Precision matching reduces food waste to near-zero",
              "Empowers frontline NGOs & grassroots volunteers",
              "Guarantees safe, timely pickups every single time",
              "Builds compassionate, self-sustaining communities",
              "Transparent audit trail from listing to delivery",
            ].map((text, i) => (
              <div className="ab-why-item" key={i}>
                <div className="ab-why-check">✓</div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-sep" />

      {/* ══ HOW IT WORKS ══ */}
      <section className="ab-section ab-how" id="how-it-works">
        <div className="ab-how-inner">
          <div className="ab-how-header">
            <p className="ab-tag rv">How It Works</p>
            <h2 className="ab-h2 rv rv-d1">
              From surplus to <em>plate</em><br />in minutes
            </h2>
          </div>

          <div className="ab-timeline">
            {HOW_STEPS.map((step, i) => (
              <MotionLink
                key={i}
                to={step.to}
                className={`ab-step ${step.color} rv rv-d${i + 1}`}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="ab-step-icon" style={{ background: stepIconBg[i] }}>
                  <span style={{ fontSize: 24 }}>{step.emoji}</span>
                </div>
                <h3 className="ab-step-title">{step.title}</h3>
                <p className="ab-step-body">{step.body}</p>
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-sep" />

      {/* ══ IMPACT ══ */}
      <section className="ab-section ab-impact" id="impact">
        <div className="ab-impact-watermark" aria-hidden>Impact</div>
        <div className="ab-impact-inner">
          <div>
            <p className="ab-tag rv">Our Impact</p>
            <h2 className="ab-h2 rv rv-d1">
              Numbers that<br /><em>speak for themselves</em>
            </h2>
            <p className="ab-p rv rv-d2">
              Every metric below is a life touched, a family fed, a community strengthened.
              We don't just count meals — we count moments of dignity restored.
            </p>
            <p className="ab-p rv rv-d3">
              Our technology runs 24/7, so that even at 11 PM, a hotel kitchen's leftovers
              become a shelter's midnight supper.
            </p>
          </div>

          <div className="ab-impact-grid rv rv-d2">
            {IMPACT.map((card, i) => (
              <div className="ab-impact-card" key={i}>
                <div
                  className="ab-impact-glow"
                  style={{ background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)` }}
                />
                <span className="ab-impact-icon">{card.emoji}</span>
                <div className="ab-impact-num" style={{ color: card.color }}>
                  <Counter to={card.num} suffix={card.suffix} />
                </div>
                <div className="ab-impact-label">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-sep" />

      {/* ══ VALUES ══ */}
      <section className="ab-section ab-values" id="values">
        <div className="ab-values-inner">
          <div className="ab-values-header">
            <p className="ab-tag rv">Our Principles</p>
            <h2 className="ab-h2 rv rv-d1">
              Values we <em>never</em> compromise
            </h2>
            <p className="ab-p rv rv-d2" style={{ textAlign: "center" }}>
              Trust, safety, and transparency are the foundation of every feature we build.
            </p>
          </div>

          <div className="ab-values-grid">
            {VALUES.map((v, i) => (
              <div className={`ab-value-card rv rv-d${i + 1}`} key={i}>
                <span className="ab-value-emoji">{v.emoji}</span>
                <h4 className="ab-value-title">{v.title}</h4>
                <p className="ab-value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-sep" />

      {/* ══ QUOTE ══ */}
      <section className="ab-quote">
        <div className="ab-quote-bg" aria-hidden>"</div>
        <div className="ab-quote-inner">
          <span className="ab-quote-mark rv">"</span>
          <blockquote className="ab-quote-text rv rv-d1">
            We don't just rescue food — we rescue{" "}
            <em>dignity, community,</em> and the belief that no one
            should go hungry when there's abundance nearby.
          </blockquote>
          <div className="ab-quote-attr rv rv-d2">
            <div className="ab-quote-avatar">🌿</div>
            <div>
              <div className="ab-quote-name">Arjun Kumar</div>
              <div className="ab-quote-role">Co-Founder & Operations Lead, ResQPlate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="ab-cta">
        <div className="ab-cta-glow" />
        <div className="ab-cta-grid" />

        <div className="ab-cta-inner">
          <p className="ab-tag rv" style={{ display: "flex", justifyContent: "center" }}>
            Join the Movement
          </p>
          <h2 className="ab-cta-h2 rv rv-d1">
            Together, we can<br /><em>end food waste.</em>
          </h2>
          <p className="ab-cta-sub rv rv-d2">
            Every surplus plate is someone's next meal. Every second counts.
            Be the bridge between abundance and need.
          </p>

          <div className="ab-cta-btns rv rv-d3">
            <Link to="/register" className="ab-btn-primary">
              Get Started Free <span className="arr">→</span>
            </Link>
            <Link to="/dashboard/search" className="ab-btn-ghost">
              Browse Listings
            </Link>
          </div>

          <div className="ab-partners rv rv-d4">
            <div className="ab-partners-label">Trusted Partners</div>
            <div className="ab-partners-row">
              {["Akshaya Patra", "Feeding India", "Robin Hood Army", "No Food Waste"].map(p => (
                <div className="ab-partner-pill" key={p}>{p}</div>
              ))}
            </div>
          </div>

          <p className="ab-cta-foot rv rv-d5">
            © 2026 ResQPlate — Built for Social Impact · All food is free
          </p>
        </div>
      </section>
    </>
  );
}
