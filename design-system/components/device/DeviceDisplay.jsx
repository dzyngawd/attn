import React from 'react';
import { AttnFace, useAttnKeyframes } from './AttnFace.jsx';
import { AttnOrb } from './AttnOrb.jsx';
import { WidgetItems } from '../figma/WidgetItems.jsx';

const KF = `
@keyframes attn-item-in{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
@keyframes attn-fade-in{from{opacity:0}to{opacity:1}}
@keyframes attn-alert-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,69,59,.0),0px 8.459px 16.494px 0px rgba(0,0,0,0.08)}50%{box-shadow:0 0 0 10px rgba(255,69,59,.55),0px 8.459px 16.494px 0px rgba(0,0,0,0.08)}}`;

const DEFAULT_ITEMS = [
  { symbol: '$', title: 'Credit card payment', status: 'Due Today', tile: 'rgb(217,236,255)' },
  { symbol: '✈︎', title: 'Flight check-in', status: 'Closes in 30mins', tile: 'rgb(255,229,204)' },
  { symbol: '▤', title: 'Tax filing notice', status: 'Closes in 1hour', tile: 'rgb(204,247,255)' },
];
const STATE_LABEL = { listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking' };
const FACE_FOR = { display: 'neutral', happy: 'happy', puzzled: 'puzzled', alert: 'surprised' };

/** attn device display — landscape 1328×616 screen from the Figma "Display"/"AI Listening" frames. */
export function DeviceDisplay({ state = 'display', time = '12:42', date = 'Monday, July 3rd 2026', items = DEFAULT_ITEMS, scale = 0.5, animate = true, style }) {
  useAttnKeyframes('attn-device-kf', KF);
  const voice = STATE_LABEL[state];
  const face = FACE_FOR[state];
  const W = 1328, H = 616;
  return (
    <div style={{ width: W * scale, height: H * scale, position: 'relative', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', borderRadius: 'var(--r-device)', overflow: 'hidden', background: 'var(--grad-sky)', boxShadow: 'var(--shadow-device)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 21.146, padding: 24, boxSizing: 'border-box' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 31.72 }}>
            <div style={{ height: 173, display: 'flex', flexDirection: 'column', gap: 52, alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-clock)', fontSize: 128, lineHeight: 0.72, color: '#fff' }}>{time}</span>
              <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 500, fontSize: 24, lineHeight: 1, color: '#fff', opacity: 0.8 }}>{date}</span>
            </div>
            <div style={{ height: 363, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {face && <AttnFace key={state} expression={face} animate={animate} scale={0.62} />}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 31.72, justifyContent: 'flex-start' }}>
            {items.slice(0, 3).map((it, i) => (
              <div key={it.title + state} style={{ width: 629.427, height: 169.172, animation: animate ? `attn-item-in var(--dur-list) var(--ease-content) ${i * 60}ms both` : 'none' }}>
                <div style={{ transform: 'scale(2.1667)', transformOrigin: '0 0', width: 290.5 }}>
                  <WidgetItems property1="extra large" text1={it.symbol} text2={it.title} status={it.status} statusTone={it.tone || 'red'} tileColor={it.tile}
                    style={{ height: 78.08, justifyContent: 'center', animation: animate && state === 'alert' && i === 0 ? 'attn-alert-pulse 1200ms ease-in-out infinite' : 'none' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {voice && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.36)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, animation: animate ? 'attn-fade-in var(--dur-content) var(--ease-out) both' : 'none' }}>
            <AttnOrb state={state} size={295} animate={animate} />
            <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 500, fontSize: 32, color: '#fff', minWidth: 160 }}>{voice}</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-device)', boxShadow: 'inset 0 0 0 11.644px rgb(255,255,255)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
export default DeviceDisplay;
