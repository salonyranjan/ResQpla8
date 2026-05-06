import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════ */
const THEMES = {
  dark: {
    "--bg-base":       "#070c05",
    "--bg-alt":        "#0d1409",
    "--bg-card":       "#111a0d",
    "--bg-card2":      "#162010",
    "--border":        "rgba(122,188,62,0.10)",
    "--border-med":    "rgba(122,188,62,0.20)",
    "--accent":        "#7abc3e",
    "--accent2":       "#4a9c1a",
    "--amber":         "#e09a2e",
    "--teal":          "#1fb8a0",
    "--text":          "#edf5e1",
    "--text-sub":      "#9bbf74",
    "--text-faint":    "rgba(155,191,116,0.40)",
    "--hero-bg":       "#060b04",
    "--hero-glow1":    "rgba(74,156,26,0.28)",
    "--hero-glow2":    "rgba(30,155,130,0.18)",
    "--hero-glow3":    "rgba(224,154,46,0.14)",
  },
  light: {
    "--bg-base":       "#f5f9ef",
    "--bg-alt":        "#edf5e1",
    "--bg-card":       "#ffffff",
    "--bg-card2":      "#f0f7e5",
    "--border":        "rgba(45,90,16,0.09)",
    "--border-med":    "rgba(45,90,16,0.18)",
    "--accent":        "#3a8c10",
    "--accent2":       "#2d6e0a",
    "--amber":         "#c07818",
    "--teal":          "#0d8b76",
    "--text":          "#1a2e0a",
    "--text-sub":      "#4a6e28",
    "--text-faint":    "rgba(60,80,30,0.38)",
    "--hero-bg":       "#0a1406",
    "--hero-glow1":    "rgba(74,156,26,0.35)",
    "--hero-glow2":    "rgba(30,155,130,0.22)",
    "--hero-glow3":    "rgba(224,154,46,0.18)",
  },
};

/* ═══════════════════════════════════════════════════
   GLOBAL CSS (injected once)
═══════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700;1,800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .about-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: background 0.45s ease, color 0.45s ease;
    overflow-x: hidden;
  }

  /* ── Typography ── */
  .display { font-family: 'Playfair Display', Georgia, serif; }

  /* ── Scroll reveal ── */
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

  /* ── Dark toggle ── */
  .mode-btn {
    position: fixed;
    top: 22px;
    right: 22px;
    z-index: 999;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    border: 1.5px solid var(--border-med);
    background: var(--bg-card);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.3s ease,
                background 0.4s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  }
  .mode-btn:hover { transform: scale(1.12) rotate(8deg); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

  /* ════════════════════
     HERO
  ════════════════════ */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 100px 24px 80px;
    background: var(--hero-bg);
    position: relative;
    overflow: hidden;
  }

  .hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.028;
    pointer-events: none;
    z-index: 1;
  }

  .hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    animation: blob-drift 18s ease-in-out infinite alternate;
  }
  .hero-glow-a {
    width: 700px; height: 700px;
    background: var(--hero-glow1);
    top: -200px; left: -200px;
    animation-duration: 22s;
  }
  .hero-glow-b {
    width: 500px; height: 500px;
    background: var(--hero-glow2);
    bottom: -100px; right: -100px;
    animation-duration: 16s;
    animation-direction: alternate-reverse;
  }
  .hero-glow-c {
    width: 300px; height: 300px;
    background: var(--hero-glow3);
    top: 55%; left: 52%;
    animation-duration: 12s;
  }

  @keyframes blob-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(50px,40px) scale(1.12); }
  }

  /* Mesh grid overlay */
  .hero-mesh {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(122,188,62,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,188,62,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%);
  }

  .hero-content { position: relative; z-index: 2; max-width: 860px; }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(122,188,62,0.10);
    border: 1px solid rgba(122,188,62,0.22);
    border-radius: 100px;
    padding: 6px 18px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 28px;
  }
  .hero-pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(1.4); }
  }

  .hero-h1 {
    font-size: clamp(52px, 9vw, 104px);
    font-weight: 900;
    line-height: 0.95;
    color: #edf5e1;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .hero-h1-em {
    font-style: italic;
    color: var(--accent);
    position: relative;
  }
  .hero-h1-em::after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 0; right: 0;
    height: 4px;
    border-radius: 2px;
    background: var(--amber);
    transform: scaleX(0);
    transform-origin: left;
    animation: underline-reveal 1s 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  @keyframes underline-reveal { to { transform: scaleX(1); } }

  .hero-sub {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(17px, 2.5vw, 24px);
    font-weight: 400;
    color: rgba(200,230,170,0.7);
    max-width: 580px;
    margin: 28px auto 0;
    line-height: 1.65;
  }

  /* Hero stats */
  .hero-stats {
    display: flex;
    gap: 0;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 56px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(122,188,62,0.14);
    border-radius: 20px;
    padding: 24px 32px;
    backdrop-filter: blur(12px);
  }
  .hero-stat {
    padding: 0 36px;
    text-align: center;
    position: relative;
  }
  .hero-stat + .hero-stat::before {
    content: '';
    position: absolute;
    left: 0; top: 10%; bottom: 10%;
    width: 1px;
    background: rgba(122,188,62,0.14);
  }
  .hero-stat-n {
    font-family: 'Playfair Display', serif;
    font-size: 44px;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
  }
  .hero-stat-l {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(155,191,116,0.55);
    margin-top: 8px;
  }

  /* Scroll cue */
  .scroll-cue {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: rgba(155,191,116,0.40);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, rgba(122,188,62,0.5), transparent);
    animation: scroll-line 2.4s ease-in-out infinite;
  }
  @keyframes scroll-line {
    0%   { transform: scaleY(0.4) translateY(-30px); opacity:0; }
    50%  { transform: scaleY(1)   translateY(0);     opacity:1; }
    100% { transform: scaleY(0.4) translateY(30px);  opacity:0; }
  }

  /* ════════════════════
     ORIGIN STORY
  ════════════════════ */
  .section { padding: 120px 24px; }

  .origin {
    background: var(--bg-base);
  }
  .origin-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 80px;
    align-items: center;
  }
  @media (max-width: 840px) {
    .origin-inner { grid-template-columns: 1fr; gap: 48px; }
  }

  .tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 18px;
    position: relative;
    padding-left: 20px;
  }
  .tag::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 12px;
    height: 2px;
    background: var(--amber);
    border-radius: 1px;
  }

  .sec-h2 {
    font-size: clamp(30px, 4.5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    color: var(--text);
    letter-spacing: -0.025em;
    margin-bottom: 24px;
  }
  .sec-h2 em { font-style: italic; color: var(--accent); }

  .sec-p {
    font-size: 16px;
    line-height: 1.85;
    color: var(--text-sub);
    margin-bottom: 18px;
  }

  /* Why card (dark inset) */
  .why-card {
    background: var(--bg-card2);
    border: 1px solid var(--border-med);
    border-radius: 28px;
    padding: 44px 40px;
    position: relative;
    overflow: hidden;
  }
  .why-card::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
    opacity: 0.07;
    pointer-events: none;
  }
  .why-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 21px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 28px;
  }
  .why-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;
    font-size: 14.5px;
    color: var(--text-sub);
    line-height: 1.6;
  }
  .why-check {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: var(--accent2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #edf5e1;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ════════════════════
     HOW IT WORKS — timeline
  ════════════════════ */
  .how {
    background: var(--bg-alt);
    position: relative;
    overflow: hidden;
  }
  .how-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 80px;
  }
  .how-inner { max-width: 1120px; margin: 0 auto; }

  .how-timeline {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    position: relative;
  }
  .how-timeline::before {
    content: '';
    position: absolute;
    top: 52px;
    left: 12.5%;
    right: 12.5%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--teal), var(--amber), transparent);
    opacity: 0.25;
  }
  @media (max-width: 760px) {
    .how-timeline { grid-template-columns: 1fr 1fr; }
    .how-timeline::before { display: none; }
  }
  @media (max-width: 440px) {
    .how-timeline { grid-template-columns: 1fr; }
  }

  .how-step {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 32px 24px;
    text-align: center;
    position: relative;
    transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.35s ease,
                border-color 0.3s ease;
  }
  .how-step:hover {
    transform: translateY(-10px);
    box-shadow: 0 28px 64px rgba(0,0,0,0.22);
    border-color: var(--border-med);
  }
  .how-step-num {
    width: 52px; height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin: 0 auto 20px;
    border: 1px solid var(--border-med);
  }
  .how-step-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
  }
  .how-step-body {
    font-size: 13px;
    line-height: 1.75;
    color: var(--text-sub);
  }

  /* Step accent bars */
  .how-step::after {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    transition: height 0.3s ease;
  }
  .how-step:hover::after { height: 5px; }
  .step-c-green::after { background: var(--accent); }
  .step-c-teal::after  { background: var(--teal); }
  .step-c-amber::after { background: var(--amber); }
  .step-c-leaf::after  { background: var(--accent2); }

  /* ════════════════════
     IMPACT NUMBERS
  ════════════════════ */
  .impact {
    background: var(--bg-base);
    position: relative;
    overflow: hidden;
  }
  .impact-bg-text {
    position: absolute;
    font-family: 'Playfair Display', serif;
    font-size: 340px;
    font-weight: 900;
    color: var(--accent);
    opacity: 0.025;
    top: -60px;
    left: -20px;
    user-select: none;
    pointer-events: none;
    line-height: 1;
  }
  .impact-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  @media (max-width: 760px) {
    .impact-inner { grid-template-columns: 1fr; gap: 48px; }
  }

  .impact-numbers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .impact-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 32px 24px;
    position: relative;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease;
  }
  .impact-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: var(--border-med);
  }
  .impact-card-glow {
    position: absolute;
    top: -30px; right: -30px;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: 0.18;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .impact-card:hover .impact-card-glow { opacity: 0.32; }
  .impact-num {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 8px;
  }
  .impact-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
  }
  .impact-icon {
    font-size: 28px;
    margin-bottom: 16px;
    display: block;
  }

  /* ════════════════════
     VALUES
  ════════════════════ */
  .values {
    background: var(--bg-alt);
    position: relative;
  }
  .values-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 72px;
  }
  .values-inner { max-width: 1120px; margin: 0 auto; }
  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 840px) {
    .values-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 440px) {
    .values-grid { grid-template-columns: 1fr; }
  }

  .value-card {
    background: var(--bg-card2);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 38px 28px;
    position: relative;
    overflow: hidden;
    transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.35s ease;
  }
  .value-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  }
  .value-card::after {
    content: '';
    position: absolute;
    bottom: -50px; right: -50px;
    width: 130px; height: 130px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.06;
    transition: transform 0.45s ease, opacity 0.35s ease;
  }
  .value-card:hover::after { transform: scale(1.6); opacity: 0.12; }

  .value-emoji { font-size: 36px; display: block; margin-bottom: 20px; }
  .value-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .value-body { font-size: 13.5px; line-height: 1.75; color: var(--text-sub); }

  /* ════════════════════
     TESTIMONIAL / QUOTE
  ════════════════════ */
  .quote-section {
    background: var(--bg-base);
    padding: 100px 24px;
    position: relative;
    overflow: hidden;
  }
  .quote-bg {
    position: absolute;
    font-family: 'Playfair Display', serif;
    font-size: 520px;
    font-weight: 900;
    color: var(--accent);
    opacity: 0.022;
    top: -120px;
    left: -30px;
    line-height: 1;
    user-select: none;
    pointer-events: none;
  }
  .quote-inner {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .quote-mark {
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 800;
    color: var(--accent);
    line-height: 0.6;
    display: block;
    margin-bottom: 32px;
    opacity: 0.6;
  }
  .quote-text {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 3.5vw, 38px);
    font-weight: 600;
    font-style: italic;
    line-height: 1.45;
    color: var(--text);
    letter-spacing: -0.01em;
    margin-bottom: 40px;
  }
  .quote-text em { color: var(--accent); font-style: normal; }
  .quote-attr {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }
  .quote-avatar {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--teal));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 2px solid var(--border-med);
  }
  .quote-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }
  .quote-role { font-size: 12px; color: var(--text-faint); margin-top: 2px; }

  /* ════════════════════
     CTA
  ════════════════════ */
  .cta-section {
    background: linear-gradient(160deg, #0d2206 0%, #0a1a04 50%, #061008 100%);
    padding: 120px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-glow-a {
    position: absolute;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(74,156,26,0.28) 0%, transparent 65%);
    pointer-events: none;
  }
  .cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(122,188,62,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,188,62,0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at 50% 0%, black 0%, transparent 60%);
  }

  .cta-inner {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
  }
  .cta-h2 {
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 900;
    line-height: 1.05;
    color: #edf5e1;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
  }
  .cta-h2 em { font-style: italic; color: #7abc3e; }
  .cta-sub {
    font-size: 17px;
    color: rgba(200,230,170,0.6);
    line-height: 1.75;
    margin-bottom: 52px;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-btns {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #7abc3e;
    color: #070c05;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 17px 40px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.35s ease,
                background 0.25s ease;
    box-shadow: 0 6px 32px rgba(122,188,62,0.40);
  }
  .btn-primary:hover {
    transform: translateY(-5px) scale(1.04);
    box-shadow: 0 16px 48px rgba(122,188,62,0.55);
    background: #9ad458;
  }
  .btn-primary .arr { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .btn-primary:hover .arr { transform: translateX(5px); }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.06);
    color: rgba(200,230,170,0.85);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 17px 36px;
    border-radius: 100px;
    border: 1px solid rgba(122,188,62,0.22);
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                background 0.3s ease,
                border-color 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .btn-ghost:hover {
    transform: translateY(-4px);
    background: rgba(122,188,62,0.10);
    border-color: rgba(122,188,62,0.40);
  }

  /* ── Partnership logos ── */
  .partners {
    margin-top: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .partners-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(155,191,116,0.35);
  }
  .partners-row {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .partner-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(122,188,62,0.14);
    border-radius: 100px;
    padding: 8px 20px;
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(200,230,170,0.40);
    letter-spacing: 0.06em;
  }

  .cta-foot {
    margin-top: 60px;
    font-size: 11px;
    color: rgba(155,191,116,0.25);
    letter-spacing: 0.08em;
  }

  /* ── Separator ── */
  .sep {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-med), transparent);
    margin: 0;
  }
`;

/* ─── Animated counter ─── */
function Counter({ to, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let current = 0;
      const duration = 1800;
      const steps = 70;
      const increment = to / steps;
      const interval = duration / steps;
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

/* ─── Scroll reveal hook ─── */
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

/* ─── CSS var applier ─── */
function applyTheme(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
}

/* ═══════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
═══════════════════════════════════════════════════ */
export default function About() {
  const [dark, setDark] = useState(true);
  useReveal();

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "about-global";
    style.textContent = GLOBAL_CSS;
    document.getElementById("about-global")?.remove();
    document.head.appendChild(style);
    return () => document.getElementById("about-global")?.remove();
  }, []);

  useEffect(() => {
    applyTheme(dark ? THEMES.dark : THEMES.light);
  }, [dark]);

  /* ── HOW steps ── */
  const HOW_STEPS = [
    { emoji: "🍽️", title: "Food Listed",    body: "Restaurants, events & households list surplus food with expiry time and quantity.", color: "step-c-green" },
    { emoji: "📍", title: "Smart Matched",  body: "Our algorithm instantly notifies the nearest verified NGO or volunteer.", color: "step-c-teal" },
    { emoji: "🤝", title: "Claim & Pickup", body: "Verified receivers claim the listing and coordinate pickup within minutes.", color: "step-c-amber" },
    { emoji: "❤️", title: "Meal Delivered", body: "Safe, warm food reaches families in need — tracked end-to-end.", color: "step-c-leaf" },
  ];

  /* ── Impact cards ── */
  const IMPACT = [
    { emoji: "🍽️", num: 12000, suffix: "+", label: "Meals Rescued",   color: "var(--accent)",  glow: "#7abc3e" },
    { emoji: "🌿", num: 4200,  suffix: "kg", label: "CO₂ Offset",     color: "var(--teal)",   glow: "#1fb8a0" },
    { emoji: "🤝", num: 340,   suffix: "+",  label: "NGO Partners",   color: "var(--amber)",  glow: "#e09a2e" },
    { emoji: "👥", num: 1800,  suffix: "+",  label: "Volunteers",     color: "var(--accent)", glow: "#7abc3e" },
  ];

  /* ── Values ── */
  const VALUES = [
    { emoji: "🛡️", title: "Food Safety",    body: "Only safe, within-expiry food enters our network. Every listing is timestamped and tracked." },
    { emoji: "🔐", title: "Secure Access",   body: "Role-based authentication protects donors, NGOs, and volunteers at every touchpoint." },
    { emoji: "⚖️", title: "Transparency",    body: "A clear, auditable claim-and-pickup workflow means zero ambiguity from listing to plate." },
    { emoji: "🌍", title: "Social Impact",   body: "We build sustainable food systems — not charity, but community-powered change." },
  ];

  return (
    <>
      {/* Dark mode toggle */}
      <button
        className="mode-btn"
        onClick={() => setDark(d => !d)}
        aria-label="Toggle dark mode"
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div
        className="about-root"
        style={{
          background: "var(--bg-base)",
          color: "var(--text)",
        }}
      >

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="hero-grain" />
          <div className="hero-mesh" />
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />
          <div className="hero-glow hero-glow-c" />

          <div className="hero-content">
            <div className="hero-pill rv">
              <div className="hero-pill-dot" />
              Our Story
            </div>

            <h1 className="hero-h1 display rv rv-d1">
              Rescue Food.<br />
              <span className="hero-h1-em">Restore Hope.</span>
            </h1>

            <p className="hero-sub rv rv-d2">
              Bridging the gap between surplus and need —<br />
              one rescued meal at a time.
            </p>

            <div className="hero-stats rv rv-d3">
              <div className="hero-stat">
                <div className="hero-stat-n"><Counter to={12000} suffix="+" /></div>
                <div className="hero-stat-l">Meals Rescued</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n"><Counter to={340} suffix="+" /></div>
                <div className="hero-stat-l">NGO Partners</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n"><Counter to={98} suffix="%" /></div>
                <div className="hero-stat-l">Safe Delivery Rate</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n"><Counter to={4200} suffix="kg" /></div>
                <div className="hero-stat-l">CO₂ Offset</div>
              </div>
            </div>
          </div>

          <div className="scroll-cue">
            <div className="scroll-line" />
            Scroll
          </div>
        </section>

        <div className="sep" />

        {/* ══ ORIGIN / MISSION ══ */}
        <section className="section origin">
          <div className="origin-inner">
            <div>
              <p className="tag rv">Our Mission</p>
              <h2 className="sec-h2 display rv rv-d1">
                Technology in service<br />of <em>humanity</em>
              </h2>
              <p className="sec-p rv rv-d2">
                ResQPlate is a precision-built platform that turns food waste
                into community nourishment. We connect restaurants, event
                organizers, and households with verified NGOs and volunteers
                in real time — no food left behind.
              </p>
              <p className="sec-p rv rv-d3">
                Powered by geolocation, smart matching, and role-based
                authentication, every surplus plate finds its rightful place
                at someone's table before the clock runs out.
              </p>
            </div>

            <div className="why-card rv rv-d2">
              <h3 className="why-card-title display">Why ResQPlate?</h3>
              {[
                "Precision matching reduces food waste to near-zero",
                "Empowers frontline NGOs & grassroots volunteers",
                "Guarantees safe, timely pickups every single time",
                "Builds compassionate, self-sustaining communities",
                "Transparent audit trail from listing to delivery",
              ].map((text, i) => (
                <div className="why-item" key={i}>
                  <div className="why-check">✓</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sep" />

        {/* ══ HOW IT WORKS ══ */}
        <section className="section how">
          <div className="how-inner">
            <div className="how-header">
              <p className="tag rv">How It Works</p>
              <h2 className="sec-h2 display rv rv-d1">
                From surplus to <em>plate</em><br />in minutes
              </h2>
            </div>

            <div className="how-timeline">
              {HOW_STEPS.map((step, i) => (
                <div
                  className={`how-step ${step.color} rv rv-d${i + 1}`}
                  key={i}
                >
                  <div
                    className="how-step-num"
                    style={{
                      background: `rgba(122,188,62,${0.06 + i * 0.04})`,
                    }}
                  >
                    {step.emoji}
                  </div>
                  <h3 className="how-step-title display">{step.title}</h3>
                  <p className="how-step-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sep" />

        {/* ══ IMPACT ══ */}
        <section className="section impact">
          <div className="impact-bg-text" aria-hidden>Impact</div>
          <div className="impact-inner">
            <div>
              <p className="tag rv">Our Impact</p>
              <h2 className="sec-h2 display rv rv-d1">
                Numbers that<br /><em>speak for themselves</em>
              </h2>
              <p className="sec-p rv rv-d2">
                Every metric below is a life touched, a family fed, a community
                strengthened. We don't just count meals — we count moments of
                dignity restored.
              </p>
              <p className="sec-p rv rv-d3">
                Our technology runs 24/7, so that even at 11 PM, a hotel
                kitchen's leftovers become a shelter's midnight supper.
              </p>
            </div>

            <div className="impact-numbers rv rv-d2">
              {IMPACT.map((card, i) => (
                <div className="impact-card" key={i}>
                  <div
                    className="impact-card-glow"
                    style={{ background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)` }}
                  />
                  <span className="impact-icon">{card.emoji}</span>
                  <div className="impact-num" style={{ color: card.color }}>
                    <Counter to={card.num} suffix={card.suffix} />
                  </div>
                  <div className="impact-label">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sep" />

        {/* ══ VALUES ══ */}
        <section className="section values">
          <div className="values-inner">
            <div className="values-header">
              <p className="tag rv">Our Principles</p>
              <h2 className="sec-h2 display rv rv-d1">
                Values we <em>never</em> compromise
              </h2>
              <p className="sec-p rv rv-d2" style={{ textAlign: "center" }}>
                Trust, safety, and transparency are the foundation of every
                feature we build.
              </p>
            </div>

            <div className="values-grid">
              {VALUES.map((v, i) => (
                <div className={`value-card rv rv-d${i + 1}`} key={i}>
                  <span className="value-emoji">{v.emoji}</span>
                  <h4 className="value-title display">{v.title}</h4>
                  <p className="value-body">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sep" />

        {/* ══ QUOTE ══ */}
        <section className="quote-section">
          <div className="quote-bg" aria-hidden>"</div>
          <div className="quote-inner">
            <span className="quote-mark rv">"</span>
            <blockquote className="quote-text display rv rv-d1">
              We don't just rescue food — we rescue{" "}
              <em>dignity, community,</em> and the belief that no one
              should go hungry when there's abundance nearby.
            </blockquote>
            <div className="quote-attr rv rv-d2">
              <div className="quote-avatar">🌿</div>
              <div>
                <div className="quote-name">Arjun Kumar</div>
                <div className="quote-role">Co-Founder & Operations Lead, ResQPlate</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="cta-section">
          <div className="cta-glow-a" />
          <div className="cta-grid" />

          <div className="cta-inner">
            <p
              className="tag rv"
              style={{ color: "#7abc3e", justifyContent: "center", display: "flex" }}
            >
              Join the Movement
            </p>
            <h2 className="cta-h2 display rv rv-d1">
              Together, we can<br /><em>end food waste.</em>
            </h2>
            <p className="cta-sub rv rv-d2">
              Every surplus plate is someone's next meal.
              Every second counts. Be the bridge between
              abundance and need.
            </p>

            <div className="cta-btns rv rv-d3">
              <a href="/signup" className="btn-primary">
                Get Started Free
                <span className="arr">→</span>
              </a>
              <a href="/dashboard/search" className="btn-ghost">
                Browse Listings
              </a>
            </div>

            <div className="partners rv rv-d4">
              <div className="partners-label">Trusted Partners</div>
              <div className="partners-row">
                {["Akshaya Patra", "Feeding India", "Robin Hood Army", "No Food Waste"].map(p => (
                  <div className="partner-pill" key={p}>{p}</div>
                ))}
              </div>
            </div>

            <p className="cta-foot rv rv-d5">
              © 2025 ResQPlate — Built for Social Impact · All food is free
            </p>
          </div>
        </section>

      </div>
    </>
  );
}