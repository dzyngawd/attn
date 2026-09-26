import React from 'react';

const KF = `
@keyframes attn-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
@keyframes attn-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes attn-look{0%,40%,100%{transform:translateX(0)}50%,85%{transform:translateX(10px)}}
@keyframes attn-bubble-pop{0%{transform:scale(.6) rotate(-6deg);opacity:0}60%{transform:scale(1.06) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0)}}`;
export function useAttnKeyframes(id, css) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(id)) return;
    const s = document.createElement('style'); s.id = id; s.textContent = css; document.head.appendChild(s);
  }, []);
}

const EYE = "M 10.485 0 L 80.384 5.483 L 90.869 16.45 L 90.869 87.734 L 80.384 100.071 L 15.145 94.588 L 0 82.25 L 0 12.338 L 10.485 0 Z";
const BUBBLE = "M 14.947 0 L 141.5 0 L 141.5 95.662 L 62.778 101.641 L 46.835 119.577 L 49.824 100.644 L 0 95.662 L 0 12.954 L 4.982 12.954 L 4.982 4.982 L 14.947 4.982 L 14.947 0 Z";

function Eye({ mirror, animate }) {
  return (
    <div style={{ position: 'absolute', left: mirror ? 268.582 : 0, top: 0, width: 90.869, height: 100.071, transform: mirror ? 'scaleX(-1)' : 'none' }}>
      <div style={{ width: '100%', height: '100%', transformOrigin: '50% 60%', animation: animate ? 'attn-blink 4.2s var(--ease-out) infinite' : 'none' }}>
        <svg width="90.869" height="100.071" viewBox="0 0 90.869 100.071" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(-3.451px 4.601px 5.751px rgba(90,69,36,0.2392))' }}>
          <defs><linearGradient id="attnEyeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgb(43,43,45)" /><stop offset="1" stopColor="rgb(37,37,39)" /></linearGradient></defs>
          <path d={EYE} fill="url(#attnEyeG)" />
        </svg>
        <div style={{ position: 'absolute', left: 59.813, top: 17.253, width: 21.855, height: 21.855, background: '#fff', clipPath: 'polygon(0 0,100% 5.26%,100% 100%,0 94.7%)' }} />
      </div>
    </div>
  );
}

/** attn's device face — blocky eyes from the Figma "Display" frames. Native box 358.876×161.561. */
export function AttnFace({ expression = 'neutral', animate = true, scale = 1, bubble, style }) {
  useAttnKeyframes('attn-face-kf', KF);
  const mouth = expression === 'happy'
    ? <div style={{ position: 'absolute', left: 134, top: 96, width: 92, height: 50, borderBottom: '11.502px solid rgb(39,39,41)', borderLeft: '11.502px solid transparent', borderRight: '11.502px solid transparent', borderRadius: '0 0 60px 60px', boxSizing: 'border-box' }} />
    : expression === 'surprised'
    ? <div style={{ position: 'absolute', left: 161, top: 124, width: 36, height: 30, borderRadius: '50%', background: 'rgb(39,39,41)' }} />
    : <div style={{ position: 'absolute', left: 146.656, top: 141.49, width: 65.564, height: 11.502, background: 'rgb(39,39,41)' }} />;
  const showBubble = bubble ?? expression === 'puzzled';
  return (
    <div style={{ width: 358.876 * scale, height: 161.561 * scale, position: 'relative', ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 358.876, height: 161.561, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', inset: 0, animation: animate ? 'attn-float var(--dur-ambient-identity) ease-in-out infinite' : 'none' }}>
          <div style={{ position: 'absolute', inset: 0, animation: animate && expression === 'puzzled' ? 'attn-look 5s var(--ease-expressive) infinite' : 'none' }}>
            <Eye animate={animate} /><Eye mirror animate={animate} />
          </div>
          {mouth}
        </div>
        {showBubble && (
          <div style={{ position: 'absolute', left: 300, top: -70, width: 141.5, height: 119.577, transformOrigin: '20% 100%', animation: animate ? 'attn-bubble-pop var(--dur-expressive) var(--ease-expressive) both' : 'none' }}>
            <svg width="141.5" height="119.577" viewBox="0 0 141.5 119.577" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(-2px 4px 8px rgba(121,93,52,0.1882))' }}><path d={BUBBLE} fill="rgb(228,227,224)" /></svg>
            <span style={{ position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: 'var(--font-clock)', fontSize: 72, lineHeight: 1, color: 'rgb(39,39,41)' }}>{typeof bubble === 'string' ? bubble : '?'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default AttnFace;
