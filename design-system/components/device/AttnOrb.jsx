import React from 'react';
import { useAttnKeyframes } from './AttnFace.jsx';

const KF = `
@keyframes attn-orb-spin{to{transform:rotate(360deg)}}
@keyframes attn-orb-breathe{0%,100%{transform:scale(.97)}50%{transform:scale(1.03)}}
@keyframes attn-orb-talk{0%,100%{transform:scale(1)}20%{transform:scale(1.06)}40%{transform:scale(.99)}60%{transform:scale(1.04)}80%{transform:scale(1)}}
@keyframes attn-orb-think{0%,100%{transform:scale(.94);opacity:.9}50%{transform:scale(1);opacity:1}}
@keyframes attn-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.45);opacity:0}}`;
const BLOB = "M 203.92 91.629 C 203.92 173.811 143.615 137.915 47.505 164.365 C 34.313 174.441 6.422 200.638 0.392 224.821 C -5.639 249.003 59.44 278.35 92.733 290 C 137.962 284.017 247.641 255.049 324.529 187.036 C 401.418 119.023 323.901 34.007 275.532 0 C 251.661 3.149 203.92 25.883 203.92 91.629 Z";

const MOTION = {
  idle:      { spin: 'var(--dur-ambient-c)', pulse: 'attn-orb-breathe var(--dur-ambient-identity) ease-in-out infinite' },
  listening: { spin: 'var(--dur-ambient-a)', pulse: 'attn-orb-breathe 1400ms ease-in-out infinite', ring: true },
  thinking:  { spin: '2200ms',              pulse: 'attn-orb-think 900ms ease-in-out infinite' },
  speaking:  { spin: 'var(--dur-ambient-b)', pulse: 'attn-orb-talk 700ms var(--ease-expressive) infinite' },
};

/** attn assistant orb — the Figma "Loading"/"attn AI" orb (sky + sun blobs on white), animated per voice state. */
export function AttnOrb({ state = 'idle', size = 203, label, animate = true, style }) {
  useAttnKeyframes('attn-orb-kf', KF);
  const m = MOTION[state] || MOTION.idle;
  const s = size / 203;
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      {animate && m.ring && [0, 1].map(i => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${3 * s}px solid rgba(255,255,255,0.8)`, animation: `attn-ring 1600ms var(--ease-out) ${i * 800}ms infinite` }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, animation: animate ? m.pulse : 'none' }}>
        <div style={{ width: 203, height: 203, transform: `scale(${s})`, transformOrigin: '0 0', borderRadius: 1000, overflow: 'hidden', background: 'var(--surface-card)', boxShadow: 'var(--shadow-orb)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, animation: animate ? `attn-orb-spin ${m.spin} linear infinite` : 'none' }}>
            <svg width="357" height="290" viewBox="0 0 357 290" style={{ position: 'absolute', left: 6, top: -50.5 }}><path d={BLOB} fill="rgb(0,159,254)" /></svg>
            <svg width="357" height="290" viewBox="0 0 357 290" style={{ position: 'absolute', left: 0, top: 0, transform: 'matrix(-0.991,0.135,-0.135,-0.991,202.966,195.831)', transformOrigin: '0 0' }}><path d={BLOB} fill="rgb(255,214,0)" /></svg>
          </div>
          {label != null && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: 42, color: 'var(--text-black)' }}>{label}</span>}
        </div>
      </div>
    </div>
  );
}
export default AttnOrb;
