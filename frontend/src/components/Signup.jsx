import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* ═══════════════════════════════════════════════════════
   SIGNUP.JSX — God-Level Edition
   Features: Dark/Light mode, Multi-step wizard, password
   strength, avatar upload, location map preview,
   animated progress, canvas background, toasts,
   field validation, role-based fields, social signup
═══════════════════════════════════════════════════════ */

/* ── Global Styles ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  .sp-root *, .sp-root *::before, .sp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sp-root { font-family: 'DM Sans', system-ui, sans-serif; }
  .sp-root .mono { font-family: 'DM Mono', monospace; }

  /* Scrollbar */
  .sp-root ::-webkit-scrollbar { width: 4px; }
  .sp-root ::-webkit-scrollbar-thumb { background: rgba(82,183,136,0.3); border-radius: 10px; }
  .sp-form-scroll::-webkit-scrollbar { width: 0; }

  /* Keyframes */
  @keyframes sp-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes sp-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes sp-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
  @keyframes sp-slide-up{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sp-slide-right{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes sp-slide-left { from{opacity:0;transform:translateX(20px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes sp-fade-in { from{opacity:0} to{opacity:1} }
  @keyframes sp-ping    { 0%{transform:scale(1);opacity:0.7} 80%,100%{transform:scale(2.4);opacity:0} }
  @keyframes sp-shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes sp-gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes sp-morph {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%     { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%     { border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%; }
    75%     { border-radius: 40% 60% 60% 40% / 60% 30% 60% 40%; }
  }
  @keyframes sp-check-pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
  @keyframes sp-progress-fill { from{width:0} to{width:var(--target-width)} }
  @keyframes sp-count-up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  /* Input shared */
  .sp-input {
    width: 100%; border-radius: 16px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: all 0.25s;
    border: 1.5px solid transparent;
    padding: 14px 16px 14px 48px;
  }
  .sp-input.no-icon { padding-left: 16px; }
  .sp-input.with-right { padding-right: 48px; }

  /* Light inputs */
  .sp-light .sp-input {
    background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.09); color: #0a1a0d;
  }
  .sp-light .sp-input::placeholder { color: rgba(0,0,0,0.28); }
  .sp-light .sp-input:focus {
    background: #fff; border-color: #2d8a55;
    box-shadow: 0 0 0 4px rgba(45,138,85,0.1);
  }
  .sp-light .sp-input.error { border-color: #ef4444; background: rgba(239,68,68,0.04); }
  .sp-light .sp-input.success { border-color: #22c55e; }

  /* Dark inputs */
  .sp-dark .sp-input {
    background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); color: #fff;
  }
  .sp-dark .sp-input::placeholder { color: rgba(255,255,255,0.25); }
  .sp-dark .sp-input:focus {
    background: rgba(255,255,255,0.08); border-color: #52b788;
    box-shadow: 0 0 0 4px rgba(82,183,136,0.12);
  }
  .sp-dark .sp-input.error { border-color: #ef4444; background: rgba(239,68,68,0.06); }
  .sp-dark .sp-input.success { border-color: #22c55e; }

  /* Input icon */
  .sp-input-wrap { position: relative; }
  .sp-icon-left {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    pointer-events: none; transition: color 0.2s; z-index: 1;
  }
  .sp-icon-right {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    cursor: pointer; z-index: 1;
  }
  .sp-light .sp-icon-left { color: rgba(0,0,0,0.3); }
  .sp-light .sp-input-wrap:focus-within .sp-icon-left { color: #2d8a55; }
  .sp-light .sp-icon-right { color: rgba(0,0,0,0.3); }
  .sp-dark .sp-icon-left  { color: rgba(255,255,255,0.28); }
  .sp-dark .sp-input-wrap:focus-within .sp-icon-left { color: #52b788; }
  .sp-dark .sp-icon-right { color: rgba(255,255,255,0.3); }

  /* Label */
  .sp-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.13em; text-transform: uppercase;
    margin-bottom: 8px; font-family: 'DM Mono', monospace;
  }
  .sp-light .sp-label { color: rgba(0,0,0,0.38); }
  .sp-dark  .sp-label { color: rgba(255,255,255,0.32); }

  /* Error message */
  .sp-err-msg {
    font-size: 11.5px; margin-top: 5px; margin-left: 2px;
    display: flex; align-items: center; gap: 5px;
    animation: sp-slide-up 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .sp-light .sp-err-msg { color: #ef4444; }
  .sp-dark  .sp-err-msg { color: #f87171; }

  /* Role card */
  .sp-role-card {
    flex: 1; padding: 16px 10px; border-radius: 18px;
    cursor: pointer; transition: all 0.22s;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
    border: 2px solid transparent;
  }
  .sp-light .sp-role-card { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
  .sp-light .sp-role-card:hover { background: rgba(45,138,85,0.06); border-color: rgba(45,138,85,0.2); }
  .sp-light .sp-role-card.active { background: rgba(45,138,85,0.1); border-color: #2d8a55; box-shadow: 0 4px 20px rgba(45,138,85,0.2); }
  .sp-dark .sp-role-card  { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.07); }
  .sp-dark .sp-role-card:hover { background: rgba(82,183,136,0.08); border-color: rgba(82,183,136,0.2); }
  .sp-dark .sp-role-card.active { background: rgba(82,183,136,0.14); border-color: #52b788; box-shadow: 0 4px 24px rgba(82,183,136,0.2); }

  /* Step indicator dot */
  .sp-step-dot {
    width: 10px; height: 10px; border-radius: 50%; transition: all 0.3s;
    cursor: pointer;
  }
  .sp-light .sp-step-dot.done    { background: #2d8a55; }
  .sp-light .sp-step-dot.active  { background: #2d8a55; box-shadow: 0 0 0 4px rgba(45,138,85,0.2); width: 28px; border-radius: 100px; }
  .sp-light .sp-step-dot.pending { background: rgba(0,0,0,0.12); }
  .sp-dark  .sp-step-dot.done    { background: #52b788; }
  .sp-dark  .sp-step-dot.active  { background: #52b788; box-shadow: 0 0 0 4px rgba(82,183,136,0.2); width: 28px; border-radius: 100px; }
  .sp-dark  .sp-step-dot.pending { background: rgba(255,255,255,0.12); }

  /* Social btn */
  .sp-social-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 12px 0; border-radius: 14px;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .sp-light .sp-social-btn {
    background: rgba(0,0,0,0.04); border: 1.5px solid rgba(0,0,0,0.09); color: #0a1a0d;
  }
  .sp-light .sp-social-btn:hover { background: rgba(0,0,0,0.07); transform: translateY(-2px); }
  .sp-dark .sp-social-btn {
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); color: #fff;
  }
  .sp-dark .sp-social-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  /* Submit button */
  .sp-submit {
    width: 100%; padding: 15px 0; border-radius: 16px; border: none;
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    background: linear-gradient(135deg, #1a6b3c, #2d8a55, #52b788, #2d8a55, #1a6b3c);
    background-size: 300% 300%;
    animation: sp-gradient-shift 4s ease infinite;
    color: #fff;
    box-shadow: 0 12px 40px rgba(45,138,85,0.42);
  }
  .sp-submit:hover { transform: translateY(-2px); box-shadow: 0 20px 52px rgba(45,138,85,0.55); }
  .sp-submit:active { transform: translateY(0); }
  .sp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; animation: none; background: #2d8a55; }
  .sp-submit::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%); transition: transform 0.5s;
  }
  .sp-submit:not(:disabled):hover::before { transform: translateX(100%); }

  /* Nav button */
  .sp-nav-btn {
    padding: 13px 28px; border-radius: 14px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 8px;
  }
  .sp-light .sp-nav-btn.secondary {
    background: rgba(0,0,0,0.05); border: 1.5px solid rgba(0,0,0,0.09); color: rgba(0,0,0,0.5);
  }
  .sp-light .sp-nav-btn.secondary:hover { background: rgba(0,0,0,0.08); }
  .sp-dark .sp-nav-btn.secondary {
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5);
  }
  .sp-dark .sp-nav-btn.secondary:hover { background: rgba(255,255,255,0.1); }

  /* Strength bar */
  .sp-strength-bar { height: 4px; border-radius: 100px; transition: width 0.4s ease, background 0.4s ease; }

  /* Checkbox */
  .sp-check {
    appearance: none; width: 18px; height: 18px; border-radius: 6px;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .sp-light .sp-check { border: 1.5px solid rgba(0,0,0,0.15); background: rgba(0,0,0,0.03); }
  .sp-light .sp-check:checked { background: #2d8a55; border-color: #2d8a55; }
  .sp-dark .sp-check  { border: 1.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
  .sp-dark .sp-check:checked  { background: #52b788; border-color: #52b788; }

  /* Mode toggle */
  .sp-toggle { width: 48px; height: 26px; border-radius: 100px; cursor: pointer; position: relative; transition: background 0.3s; border: none; }
  .sp-toggle::after { content:''; position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#fff; transition:transform 0.3s; box-shadow:0 2px 6px rgba(0,0,0,0.25); }
  .sp-toggle.dark-on  { background: #2d8a55; }
  .sp-toggle.dark-on::after  { transform: translateX(22px); }
  .sp-toggle.dark-off { background: rgba(0,0,0,0.14); }

  /* Toast */
  .sp-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 13px 24px; border-radius: 100px;
    font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 9px;
    backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35); animation: sp-slide-up 0.3s ease;
    white-space: nowrap;
  }
  .sp-toast.success { background: rgba(45,138,85,0.95); color: #fff; }
  .sp-toast.error   { background: rgba(220,38,38,0.95);  color: #fff; }
  .sp-toast.info    { background: rgba(37,99,235,0.95);   color: #fff; }

  /* Divider */
  .sp-divider {
    display: flex; align-items: center; gap: 14px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; font-family: 'DM Mono', monospace;
  }
  .sp-divider::before, .sp-divider::after { content:''; flex:1; height:1px; }
  .sp-light .sp-divider { color: rgba(0,0,0,0.22); }
  .sp-light .sp-divider::before, .sp-light .sp-divider::after { background: rgba(0,0,0,0.07); }
  .sp-dark  .sp-divider { color: rgba(255,255,255,0.18); }
  .sp-dark  .sp-divider::before, .sp-dark  .sp-divider::after { background: rgba(255,255,255,0.07); }

  /* Avatar upload ring */
  .sp-avatar-ring {
    position: absolute; inset: -3px; border-radius: 50%;
    border: 2px dashed transparent; transition: all 0.25s;
  }
  .sp-avatar-wrap:hover .sp-avatar-ring { border-color: #52b788; transform: scale(1.04); }

  /* Location card */
  .sp-loc-card {
    border-radius: 18px; padding: 16px 18px;
    transition: all 0.25s;
  }
  .sp-light .sp-loc-card { background: rgba(0,0,0,0.03); border: 1.5px solid rgba(0,0,0,0.08); }
  .sp-dark  .sp-loc-card { background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.07); }
  .sp-light .sp-loc-card.located { border-color: #22c55e; background: rgba(34,197,94,0.04); }
  .sp-dark  .sp-loc-card.located { border-color: #22c55e; background: rgba(34,197,94,0.06); }

  /* Password req item */
  .sp-req-item { display: flex; align-items: center; gap: 7px; font-size: 11.5px; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
  .sp-req-icon { width: 14px; height: 14px; border-radius: 50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:8px; transition: all 0.2s; }
  .sp-req-icon.ok  { background: #22c55e; color: #fff; animation: sp-check-pop 0.25s ease; }
  .sp-req-icon.no  { border: 1.5px solid rgba(128,128,128,0.3); }

  /* Success screen */
  .sp-success-wrap { text-align:center; padding: 20px 0; animation: sp-slide-up 0.5s ease; }
  .sp-success-icon {
    width: 88px; height: 88px; border-radius: 50%; margin: 0 auto 28px;
    background: linear-gradient(135deg, #2d8a55, #52b788);
    display: flex; align-items: center; justify-content: center; font-size: 42px;
    box-shadow: 0 20px 56px rgba(45,138,85,0.45);
    animation: sp-float 4s ease-in-out infinite;
  }
`;

/* ── SVG Icons (no external deps) ── */
const Ic = {
  User:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Mail:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.9a16 16 0 0 0 6.18 6.18l1.95-1.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Lock:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye:         () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  MapPin:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Spinner:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:"sp-spin 0.75s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Arrow:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  ArrowLeft:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Camera:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  Sun:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  Moon:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Building:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  Shield:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:       () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  Locate:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>,
  Globe:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Google:      () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
};

/* ── Animated Canvas ── */
const AnimatedBg = ({ dark }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 42 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 2.5 + 1, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark ? `rgba(82,183,136,${p.a})` : `rgba(26,107,60,${p.a * 0.55})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = dark ? `rgba(82,183,136,${(1-d/95)*0.11})` : `rgba(26,107,60,${(1-d/95)*0.065})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dark]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
};

/* ── Password strength ── */
const PW_REQS = [
  { id:"len",   label:"8+ characters",       test: pw => pw.length >= 8 },
  { id:"upper", label:"Uppercase letter",     test: pw => /[A-Z]/.test(pw) },
  { id:"num",   label:"Number",               test: pw => /[0-9]/.test(pw) },
  { id:"sym",   label:"Special character",    test: pw => /[^A-Za-z0-9]/.test(pw) },
];
const getStrength = pw => PW_REQS.filter(r => r.test(pw)).length;
const STRENGTH_META = [
  { label:"Too weak",  color:"#ef4444", width:"15%" },
  { label:"Weak",      color:"#f97316", width:"32%" },
  { label:"Fair",      color:"#eab308", width:"58%" },
  { label:"Good",      color:"#22c55e", width:"80%" },
  { label:"Strong 💪", color:"#10b981", width:"100%" },
];

/* ── Toast ── */
const Toast = ({ toast }) => !toast ? null : (
  <div className={`sp-toast ${toast.type}`}><span>{toast.type==="success"?"✓":toast.type==="error"?"⚠":"ℹ"}</span>{toast.message}</div>
);

/* ── STEPS ── */
const STEPS = [
  { id: "role",     label: "Role",     emoji: "🎭" },
  { id: "basic",    label: "Profile",  emoji: "👤" },
  { id: "security", label: "Security", emoji: "🔒" },
  { id: "location", label: "Location", emoji: "📍" },
];

const ROLES = [
  { id: "donor", emoji: "🍱", label: "Food Donor",    desc: "Restaurant, hotel or individual with surplus food",   color: "#2d8a55" },
  { id: "ngo",   emoji: "🤝", label: "NGO Partner",   desc: "Verified nonprofit collecting and distributing meals", color: "#2563eb" },
  { id: "volunteer", emoji: "🚴", label: "Volunteer",  desc: "Individual helping with pickups and deliveries",       color: "#d97706" },
];

/* ══════════════════════════════════════════════
   MAIN SIGNUP COMPONENT
══════════════════════════════════════════════ */
const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ── State ── */
  const [dark, setDark]       = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
  const [step, setStep]       = useState(0);
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast]     = useState(null);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors]   = useState({});
  const [shake, setShake]     = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [agreed, setAgreed]   = useState(false);
  const [animDir, setAnimDir] = useState("right"); // slide direction

  const [form, setForm] = useState({
    role:       searchParams.get("role") || "donor",
    name:       "",
    email:      "",
    phone:      "",
    orgName:    "",
    password:   "",
    confirmPw:  "",
    latitude:   "",
    longitude:  "",
    city:       "",
    newsletter: true,
  });

  const fileRef = useRef(null);

  /* ── Inject styles ── */
  useEffect(() => {
    if (document.getElementById("sp-styles")) return;
    const el = document.createElement("style");
    el.id = "sp-styles"; el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.getElementById("sp-styles")?.remove();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(e2 => ({ ...e2, [name]: "" }));
  };

  /* ── Avatar ── */
  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── Location ── */
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { showToast("Geolocation not supported", "error"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({
          ...f,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
        showToast("Location captured!", "success");
        // Attempt reverse geocode via open API
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
          .then(r => r.json())
          .then(d => {
            const city = d.address?.city || d.address?.town || d.address?.village || "";
            if (city) setForm(f => ({ ...f, city }));
          }).catch(() => {});
      },
      () => { setLocating(false); showToast("Could not get location", "error"); }
    );
  }, []);

  /* ── Validation per step ── */
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.includes("@")) e.email = "Enter a valid email";
      if (form.role === "ngo" && !form.orgName.trim()) e.orgName = "Organization name required";
    }
    if (step === 2) {
      if (form.password.length < 8) e.password = "Minimum 8 characters";
      if (form.password !== form.confirmPw) e.confirmPw = "Passwords don't match";
      if (!agreed) e.agreed = "Please accept the terms";
    }
    if (step === 3) {
      if (!form.latitude || !form.longitude) e.location = "Please detect your location";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate()) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setAnimDir("right");
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const goPrev = () => { setAnimDir("left"); setStep(s => Math.max(s - 1, 0)); };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1600)); // demo delay
      /* Real API:
      const payload = { ...form, location: { type:"Point", coordinates:[+form.longitude, +form.latitude] } };
      const res = await axios.post("http://localhost:5000/api/signup", payload);
      localStorage.setItem("token", res.data.token);
      */
      setDone(true);
      showToast("Account created! Welcome 🎉", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Design tokens ── */
  const D = {
    bg:        dark ? "#071008" : "#f0f5f1",
    panel:     dark ? "rgba(10,22,14,0.95)" : "rgba(255,255,255,0.97)",
    text:      dark ? "#ffffff" : "#0a1a0d",
    textMuted: dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.38)",
    textFaint: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
    border:    dark ? "rgba(82,183,136,0.12)" : "rgba(0,0,0,0.07)",
    accent:    dark ? "#52b788" : "#2d8a55",
    heroBg:    dark
      ? "linear-gradient(148deg,#071008 0%,#0f2418 55%,#071008 100%)"
      : "linear-gradient(148deg,#122a1a 0%,#1e4d35 55%,#0f2418 100%)",
  };

  const strength = form.password ? getStrength(form.password) : -1;
  const smeta = strength >= 0 ? STRENGTH_META[strength] : null;
  const located = !!(form.latitude && form.longitude);

  /* ── Progress % ── */
  const progress = Math.round(((step) / (STEPS.length - 1)) * 100);

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className={`sp-root sp-${dark ? "dark" : "light"}`}
      style={{ minHeight:"100vh", display:"flex", background:D.bg, position:"relative", overflow:"hidden", transition:"background 0.4s" }}>

      {/* Canvas background */}
      <AnimatedBg dark={dark} />

      {/* Morphing blobs */}
      {[
        { w:700, h:700, t:"-15%", l:"-8%",  a:"sp-morph 20s ease-in-out infinite", bg: dark ? "rgba(45,138,85,0.07)" : "rgba(45,138,85,0.05)" },
        { w:550, h:550, b:"-12%", r:"-6%",  a:"sp-morph 25s ease-in-out infinite reverse", bg: dark ? "rgba(82,183,136,0.05)" : "rgba(26,107,60,0.04)" },
      ].map((b, i) => (
        <div key={i} style={{
          position:"fixed", width:b.w, height:b.h,
          borderRadius:"60% 40% 30% 70% / 60% 30% 70% 40%",
          background:`radial-gradient(circle, ${b.bg} 0%, transparent 70%)`,
          top:b.t, left:b.l, bottom:b.b, right:b.r,
          animation:b.a, pointerEvents:"none", zIndex:0,
        }} />
      ))}

      {/* ═══════ LEFT HERO ═══════ */}
      <div style={{
        width:"46%", background:D.heroBg, position:"relative", overflow:"hidden",
        flexDirection:"column", justifyContent:"center", padding:"60px 64px",
        zIndex:1,
      }} className="sp-hero-panel">
        <style>{`
          .sp-hero-panel { display:none !important; }
          @media(min-width:1024px) { .sp-hero-panel { display:flex !important; } }
        `}</style>

        {/* BG image */}
        <div style={{ position:"absolute", inset:0, opacity:0.2, backgroundImage:"url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop')", backgroundSize:"cover", backgroundPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(7,16,8,0.94) 0%,rgba(18,42,26,0.76) 100%)" }} />

        {/* Rings */}
        {[400,580,760].map((s,i) => (
          <div key={i} style={{ position:"absolute", width:s, height:s, borderRadius:"50%",
            border:`1px solid rgba(82,183,136,${0.06-i*0.014})`,
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            animation:`sp-spin ${65+i*22}s linear infinite${i%2?" reverse":""}`,
            pointerEvents:"none",
          }} />
        ))}

        <div style={{ position:"relative", zIndex:1 }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:60 }}>
            <div style={{ width:40,height:40,borderRadius:13, background:"linear-gradient(135deg,#2d8a55,#0d9488)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🌿</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>
              ResQ<span style={{ color:"#d4a017" }}>Plate</span>
            </span>
          </div>

          {/* Float icon */}
          <div style={{ width:76,height:76,borderRadius:26, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:34, animation:"sp-float 5s ease-in-out infinite" }}>
            🤲
          </div>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(38px,4vw,60px)", fontWeight:800, color:"#fff", lineHeight:0.95, marginBottom:22, letterSpacing:"-0.04em" }}>
            Turn Excess<br />into{" "}
            <span style={{ background:"linear-gradient(115deg,#d4a017,#f0c040,#d4a017)", backgroundSize:"200% 200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"sp-shimmer 3s ease infinite" }}>Impact.</span>
          </h1>

          <p style={{ fontSize:15.5, color:"rgba(255,255,255,0.45)", lineHeight:1.9, maxWidth:340, marginBottom:48, fontWeight:300 }}>
            Join thousands of restaurants and volunteers in the mission to end hunger across India.
          </p>

          {/* Step preview */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:14, opacity: i <= step ? 1 : 0.3, transition:"opacity 0.4s" }}>
                <div style={{
                  width:36, height:36, borderRadius:12, fontSize:16,
                  background: i < step ? "#2d8a55" : i === step ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                  border: i < step ? "none" : "1px solid rgba(255,255,255,0.1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.35s",
                  boxShadow: i === step ? "0 0 0 3px rgba(82,183,136,0.25)" : "none",
                }}>
                  {i < step ? "✓" : s.emoji}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color: i <= step ? "#fff" : "rgba(255,255,255,0.3)", transition:"color 0.4s" }}>{s.label}</div>
                  <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.25)", fontFamily:"'DM Mono',monospace", marginTop:2 }}>Step {i+1} of {STEPS.length}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop:36, height:4, background:"rgba(255,255,255,0.08)", borderRadius:100, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#2d8a55,#52b788)", borderRadius:100, transition:"width 0.5s ease" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"rgba(255,255,255,0.3)" }}>Progress</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, color:"#52b788" }}>{progress}%</span>
          </div>

          {/* Live badge */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:28 }}>
            <div style={{ position:"relative", width:10, height:10 }}>
              <div style={{ position:"absolute", inset:0, background:"#52b788", borderRadius:"50%", animation:"sp-ping 2.2s ease-out infinite" }} />
              <div style={{ width:10, height:10, background:"#52b788", borderRadius:"50%" }} />
            </div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(149,213,178,0.65)", letterSpacing:"0.07em" }}>
              1,200+ donors already on board
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT FORM ═══════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"36px 24px", position:"relative", zIndex:1, overflowY:"auto" }}>

        {/* Dark mode toggle */}
        <div style={{ position:"absolute", top:22, right:22, display:"flex", alignItems:"center", gap:9 }}>
          <span style={{ color:D.textMuted }}>{dark ? <Ic.Moon /> : <Ic.Sun />}</span>
          <button className={`sp-toggle ${dark?"dark-on":"dark-off"}`} onClick={() => setDark(d=>!d)} title="Toggle dark mode" />
        </div>

        {/* Mobile brand */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }} className="sp-mob-brand">
          <style>{`@media(min-width:1024px){ .sp-mob-brand{display:none!important;} }`}</style>
          <div style={{ width:34,height:34,borderRadius:11,background:"linear-gradient(135deg,#2d8a55,#0d9488)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>🌿</div>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:D.text }}>ResQ<span style={{color:"#d4a017"}}>Plate</span></span>
        </div>

        {/* Step dots (mobile) */}
        <div style={{ display:"flex", gap:8, marginBottom:28, alignItems:"center" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={`sp-step-dot ${i < step ? "done" : i === step ? "active" : "pending"}`} title={s.label} />
          ))}
        </div>

        {/* ── Card ── */}
        <div
          className={shake ? "sp-shake" : ""}
          style={{
            width:"100%", maxWidth:448,
            background:D.panel,
            borderRadius:28,
            padding:"36px 32px",
            boxShadow: dark
              ? "0 48px 120px rgba(0,0,0,0.72), 0 0 0 1px rgba(82,183,136,0.1)"
              : "0 32px 80px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.055)",
            backdropFilter:"blur(24px)",
            animation:"sp-slide-up 0.5s ease",
          }}
        >
          {done ? (
            /* ═══ SUCCESS SCREEN ═══ */
            <div className="sp-success-wrap">
              <div className="sp-success-icon">🎉</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:D.text, marginBottom:12 }}>You're in!</h2>
              <p style={{ fontSize:15, color:D.textMuted, lineHeight:1.82, marginBottom:32 }}>
                Welcome to ResQPlate, <strong style={{color:D.accent}}>{form.name.split(" ")[0]}</strong>. Your account is ready — let's rescue some food.
              </p>
              <button className="sp-submit" onClick={() => navigate("/dashboard")}>
                Go to Dashboard <Ic.Arrow />
              </button>
              <div style={{ marginTop:20, fontSize:12.5, color:D.textFaint, fontFamily:"'DM Mono',monospace" }}>
                You'll receive a confirmation email at {form.email}
              </div>
            </div>
          ) : (
            <>
              {/* ── Step Header ── */}
              <div style={{ marginBottom:26 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:40,height:40,borderRadius:14, background:dark?"rgba(82,183,136,0.12)":"rgba(45,138,85,0.1)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>
                      {STEPS[step].emoji}
                    </div>
                    <div>
                      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:D.text,lineHeight:1.1 }}>
                        {step === 0 ? "Choose your role" : step === 1 ? "Your profile" : step === 2 ? "Secure account" : "Your location"}
                      </h2>
                      <div style={{ fontSize:11.5,color:D.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace" }}>
                        Step {step+1} of {STEPS.length}
                      </div>
                    </div>
                  </div>
                  {/* Mini progress ring */}
                  <div style={{ position:"relative",width:40,height:40,flexShrink:0 }}>
                    <svg width="40" height="40" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="20" cy="20" r="16" fill="none" stroke={dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)"} strokeWidth="3"/>
                      <circle cx="20" cy="20" r="16" fill="none" stroke={D.accent} strokeWidth="3"
                        strokeDasharray={`${2*Math.PI*16}`}
                        strokeDashoffset={`${2*Math.PI*16*(1 - (step+1)/STEPS.length)}`}
                        strokeLinecap="round" style={{transition:"stroke-dashoffset 0.4s ease"}} />
                    </svg>
                    <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontFamily:"'DM Mono',monospace",color:D.accent,fontWeight:600 }}>
                      {step+1}/{STEPS.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════ STEP 0: ROLE ═══════════ */}
              {step === 0 && (
                <div style={{ animation:`sp-slide-${animDir==="right"?"right":"left"} 0.35s ease` }}>
                  {/* Social quick signup */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                    <button className="sp-social-btn" onClick={() => showToast("Google signup coming soon!", "info")}>
                      <Ic.Google /> Google
                    </button>
                    <button className="sp-social-btn" onClick={() => showToast("Apple signup coming soon!", "info")}>
                      <span style={{fontSize:18}}>🍎</span> Apple
                    </button>
                  </div>
                  <div className="sp-divider" style={{ marginBottom:20 }}>or continue with email</div>

                  <label className="sp-label">I am a…</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {ROLES.map(r => (
                      <div key={r.id}
                        className={`sp-role-card${form.role===r.id?" active":""}`}
                        style={{ flexDirection:"row", gap:14, padding:"14px 16px" }}
                        onClick={() => setForm(f=>({...f,role:r.id}))}
                      >
                        <div style={{ width:44,height:44,borderRadius:14,fontSize:22, background:`${r.color}18`, border:`1px solid ${r.color}28`, display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{r.emoji}</div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:14,fontWeight:700,color:D.text,marginBottom:3 }}>{r.label}</div>
                          <div style={{ fontSize:12,color:D.textMuted,lineHeight:1.5 }}>{r.desc}</div>
                        </div>
                        {form.role === r.id && (
                          <div style={{ width:22,height:22,borderRadius:"50%",background:D.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:"sp-check-pop 0.25s ease" }}>
                            <Ic.Check />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="sp-submit" style={{ marginTop:24 }} onClick={goNext}>
                    Continue <Ic.Arrow />
                  </button>
                </div>
              )}

              {/* ═══════════ STEP 1: BASIC INFO ═══════════ */}
              {step === 1 && (
                <div style={{ animation:`sp-slide-${animDir==="right"?"right":"left"} 0.35s ease` }}>
                  {/* Avatar upload */}
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
                    <div style={{ position:"relative" }} className="sp-avatar-wrap">
                      <div style={{ width:80,height:80,borderRadius:"50%",overflow:"hidden",cursor:"pointer", background:dark?"rgba(82,183,136,0.12)":"rgba(45,138,85,0.1)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:32, border:`2px dashed ${dark?"rgba(82,183,136,0.25)":"rgba(45,138,85,0.25)"}`, position:"relative" }}
                        onClick={() => fileRef.current?.click()}
                      >
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="avatar" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        ) : (
                          <span>👤</span>
                        )}
                        <div className="sp-avatar-ring" />
                      </div>
                      <div style={{ position:"absolute",bottom:-2,right:-2, width:26,height:26,borderRadius:"50%",background:D.accent,border:`2px solid ${D.panel}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff" }}
                        onClick={() => fileRef.current?.click()}
                      >
                        <Ic.Camera />
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar} />
                    </div>
                  </div>

                  <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                    {/* Name */}
                    <div>
                      <label className="sp-label">Full Name</label>
                      <div className="sp-input-wrap">
                        <span className="sp-icon-left"><Ic.User /></span>
                        <input className={`sp-input${errors.name?" error":form.name?" success":""}`}
                          name="name" value={form.name} placeholder="Your full name"
                          autoComplete="name" onChange={handleChange} />
                      </div>
                      {errors.name && <div className="sp-err-msg">⚠ {errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="sp-label">Email Address</label>
                      <div className="sp-input-wrap">
                        <span className="sp-icon-left"><Ic.Mail /></span>
                        <input className={`sp-input${errors.email?" error":form.email.includes("@")?" success":""}`}
                          type="email" name="email" value={form.email} placeholder="you@example.com"
                          autoComplete="email" onChange={handleChange} />
                      </div>
                      {errors.email && <div className="sp-err-msg">⚠ {errors.email}</div>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="sp-label">Phone <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10,opacity:0.6}}>(optional)</span></label>
                      <div className="sp-input-wrap">
                        <span className="sp-icon-left"><Ic.Phone /></span>
                        <input className="sp-input" name="phone" value={form.phone}
                          placeholder="+91 98765 43210" autoComplete="tel" onChange={handleChange} />
                      </div>
                    </div>

                    {/* NGO org name */}
                    {form.role === "ngo" && (
                      <div style={{ animation:"sp-slide-up 0.3s ease" }}>
                        <label className="sp-label">Organization Name</label>
                        <div className="sp-input-wrap">
                          <span className="sp-icon-left"><Ic.Building /></span>
                          <input className={`sp-input${errors.orgName?" error":""}`}
                            name="orgName" value={form.orgName} placeholder="Your NGO name"
                            onChange={handleChange} />
                        </div>
                        {errors.orgName && <div className="sp-err-msg">⚠ {errors.orgName}</div>}
                      </div>
                    )}
                  </div>

                  <div style={{ display:"flex",gap:10,marginTop:24 }}>
                    <button className="sp-nav-btn secondary" onClick={goPrev}><Ic.ArrowLeft /> Back</button>
                    <button className="sp-submit" style={{ flex:1 }} onClick={goNext}>Continue <Ic.Arrow /></button>
                  </div>
                </div>
              )}

              {/* ═══════════ STEP 2: SECURITY ═══════════ */}
              {step === 2 && (
                <div style={{ animation:`sp-slide-${animDir==="right"?"right":"left"} 0.35s ease` }}>
                  <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                    {/* Password */}
                    <div>
                      <label className="sp-label">Create Password</label>
                      <div className="sp-input-wrap">
                        <span className="sp-icon-left"><Ic.Lock /></span>
                        <input className={`sp-input with-right${errors.password?" error":""}`}
                          type={showPw?"text":"password"} name="password" value={form.password}
                          placeholder="Choose a strong password" onChange={handleChange} />
                        <span className="sp-icon-right" onClick={() => setShowPw(v=>!v)}>
                          {showPw ? <Ic.EyeOff /> : <Ic.Eye />}
                        </span>
                      </div>
                      {errors.password && <div className="sp-err-msg">⚠ {errors.password}</div>}

                      {/* Strength */}
                      {form.password && (
                        <div style={{ marginTop:10 }}>
                          <div style={{ height:4,background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)",borderRadius:100,overflow:"hidden",marginBottom:6 }}>
                            <div className="sp-strength-bar" style={{ width:smeta?.width,background:smeta?.color }} />
                          </div>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <span style={{ fontSize:10.5,color:smeta?.color,fontFamily:"'DM Mono',monospace",fontWeight:500 }}>{smeta?.label}</span>
                          </div>
                          {/* Requirements grid */}
                          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 16px",marginTop:10 }}>
                            {PW_REQS.map(req => {
                              const ok = req.test(form.password);
                              return (
                                <div key={req.id} className="sp-req-item" style={{ color: ok ? "#22c55e" : D.textMuted }}>
                                  <div className={`sp-req-icon ${ok?"ok":"no"}`}>{ok && <Ic.Check />}</div>
                                  {req.label}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    <div>
                      <label className="sp-label">Confirm Password</label>
                      <div className="sp-input-wrap">
                        <span className="sp-icon-left"><Ic.Shield /></span>
                        <input className={`sp-input with-right${errors.confirmPw?" error":form.confirmPw&&form.confirmPw===form.password?" success":""}`}
                          type={showCPw?"text":"password"} name="confirmPw" value={form.confirmPw}
                          placeholder="Repeat your password" onChange={handleChange} />
                        <span className="sp-icon-right" onClick={() => setShowCPw(v=>!v)}>
                          {showCPw ? <Ic.EyeOff /> : <Ic.Eye />}
                        </span>
                      </div>
                      {errors.confirmPw && <div className="sp-err-msg">⚠ {errors.confirmPw}</div>}
                    </div>

                    {/* Terms */}
                    <div>
                      <label style={{ display:"flex",gap:10,cursor:"pointer",alignItems:"flex-start",userSelect:"none" }}>
                        <input type="checkbox" className="sp-check" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2}} />
                        <span style={{ fontSize:12.5,color:D.textMuted,lineHeight:1.7 }}>
                          I agree to ResQPlate's{" "}
                          <span style={{ color:D.accent,fontWeight:600,cursor:"pointer" }}>Terms of Service</span>{" "}and{" "}
                          <span style={{ color:D.accent,fontWeight:600,cursor:"pointer" }}>Privacy Policy</span>
                        </span>
                      </label>
                      {errors.agreed && <div className="sp-err-msg">⚠ {errors.agreed}</div>}
                    </div>

                    {/* Newsletter */}
                    <label style={{ display:"flex",gap:10,cursor:"pointer",alignItems:"center",userSelect:"none" }}>
                      <input type="checkbox" className="sp-check" name="newsletter" checked={form.newsletter} onChange={handleChange} />
                      <span style={{ fontSize:12.5,color:D.textMuted }}>Send me impact stories & updates</span>
                    </label>
                  </div>

                  <div style={{ display:"flex",gap:10,marginTop:24 }}>
                    <button className="sp-nav-btn secondary" onClick={goPrev}><Ic.ArrowLeft /> Back</button>
                    <button className="sp-submit" style={{ flex:1 }} onClick={goNext}>Continue <Ic.Arrow /></button>
                  </div>
                </div>
              )}

              {/* ═══════════ STEP 3: LOCATION ═══════════ */}
              {step === 3 && (
                <div style={{ animation:`sp-slide-${animDir==="right"?"right":"left"} 0.35s ease` }}>
                  {/* Location card */}
                  <div className={`sp-loc-card${located?" located":""}`} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                        <div style={{ width:36,height:36,borderRadius:12,background:located?"rgba(34,197,94,0.12)":dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.3s" }}>
                          {located ? <span style={{fontSize:18}}>✅</span> : <Ic.MapPin />}
                        </div>
                        <div>
                          <div style={{ fontSize:13.5,fontWeight:600,color:D.text }}>Your Location</div>
                          <div style={{ fontSize:11.5,color:D.textMuted,marginTop:2 }}>
                            {located ? (form.city || "Location captured") : "Required for matching"}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLocate}
                        disabled={locating}
                        style={{
                          display:"flex",alignItems:"center",gap:7,
                          padding:"8px 16px",borderRadius:100,border:"none",
                          background:located?"rgba(34,197,94,0.12)":dark?"rgba(82,183,136,0.15)":"rgba(45,138,85,0.1)",
                          color:located?"#22c55e":D.accent, fontSize:13,fontWeight:700,cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",
                        }}
                      >
                        {locating ? <Ic.Spinner /> : <Ic.Locate />}
                        {locating ? "Detecting…" : located ? "Re-detect" : "Detect"}
                      </button>
                    </div>

                    {/* Coords display */}
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                      {[
                        { label:"Latitude",  val:form.latitude,  placeholder:"–" },
                        { label:"Longitude", val:form.longitude, placeholder:"–" },
                      ].map(f => (
                        <div key={f.label} style={{ background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", borderRadius:12, padding:"10px 13px" }}>
                          <div style={{ fontSize:9.5,color:D.textMuted,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>{f.label}</div>
                          <div style={{ fontSize:13,fontWeight:600,color:f.val?D.accent:D.textFaint,fontFamily:"'DM Mono',monospace" }}>
                            {f.val || f.placeholder}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.location && <div className="sp-err-msg" style={{marginTop:10}}>⚠ {errors.location}</div>}
                  </div>

                  {/* Map preview placeholder */}
                  {located && (
                    <div style={{
                      height:120, borderRadius:18, marginBottom:16, overflow:"hidden",
                      background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",
                      border:`1px solid ${D.border}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      animation:"sp-fade-in 0.4s ease",
                      position:"relative",
                    }}>
                      <img
                        src={`https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${form.longitude},${form.latitude}&z=14&l=map&size=440,120&pt=${form.longitude},${form.latitude},pm2rdl`}
                        alt="map"
                        style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.8 }}
                        onError={e => { e.target.style.display="none"; }}
                      />
                      <div style={{ position:"absolute",bottom:8,left:8, background:"rgba(0,0,0,0.7)",borderRadius:8,padding:"4px 10px",fontSize:10.5,color:"#fff",fontFamily:"'DM Mono',monospace" }}>
                        📍 {form.city || `${parseFloat(form.latitude).toFixed(3)}, ${parseFloat(form.longitude).toFixed(3)}`}
                      </div>
                    </div>
                  )}

                  {/* Manual city override */}
                  <div>
                    <label className="sp-label">City <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10,opacity:0.6}}>(optional override)</span></label>
                    <div className="sp-input-wrap">
                      <span className="sp-icon-left"><Ic.Globe /></span>
                      <input className="sp-input" name="city" value={form.city} placeholder="e.g. New Delhi" onChange={handleChange} />
                    </div>
                  </div>

                  <div style={{ display:"flex",gap:10,marginTop:22 }}>
                    <button className="sp-nav-btn secondary" onClick={goPrev}><Ic.ArrowLeft /> Back</button>
                    <button className="sp-submit" style={{ flex:1 }} onClick={handleSubmit} disabled={loading}>
                      {loading ? <><Ic.Spinner /> Creating…</> : <>Create Account <Ic.Arrow /></>}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              {!done && (
                <div style={{ textAlign:"center",marginTop:22,paddingTop:18,borderTop:`1px solid ${D.border}` }}>
                  <span style={{ fontSize:13.5,color:D.textMuted }}>Already have an account? </span>
                  <Link to="/login" style={{ fontSize:13.5,fontWeight:700,color:D.accent,textDecoration:"none" }}>
                    Sign in →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Security note */}
        <div style={{ marginTop:24,fontSize:11,color:D.textFaint,textAlign:"center",fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em" }}>
          🛡️ 256-bit SSL · Zero spam · GDPR compliant
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
};

export default Signup;