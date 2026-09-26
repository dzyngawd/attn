const { DeviceDisplay, AttnLogo, Icon } = window.AttnDesignSystem_f5a858;

const deviceT = {
  shell: { position: 'relative', borderRadius: 83.24, background: 'var(--attn-sky-soft)', boxShadow: 'inset -5.946px 5.946px 3.865px 0px rgba(255,255,255,0.36), inset 0px -5.946px 2.973px 0px rgba(0,0,0,0.25)', padding: 35.674, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, overflow: 'hidden' },
  blobA: { position: 'absolute', left: -89, top: -98, width: 559, height: 559, borderRadius: '50%', background: '#fff' },
  blobB: { position: 'absolute', right: -200, bottom: -300, width: 559, height: 559, borderRadius: '50%', background: '#fff', opacity: 0.4 },
  pill: { border: 0, borderRadius: 100, padding: '12px 18px', font: '600 14px var(--font-action)', cursor: 'pointer', transition: 'transform var(--dur-feedback) var(--ease-out), background var(--dur-micro)' },
};

const THREE_HOURS = [
  { symbol: '$', title: 'Credit card payment', status: 'Due Today', tile: 'rgb(217,236,255)' },
  { symbol: '✈︎', title: 'Flight check-in', status: 'Closes in 30mins', tile: 'rgb(255,229,204)' },
  { symbol: '▤', title: 'Tax filing notice', status: 'Closes in 1hour', tile: 'rgb(204,247,255)' },
];
const FOCUS = [
  { symbol: '♪', title: 'Focus playlist', status: 'Playing', tone: 'open', tile: 'rgb(169,239,228)' },
  ...THREE_HOURS.slice(0, 2),
];
const BLOCKED = [
  { symbol: '◷', title: 'Focus time', status: 'Blocked · next 2 hours', tone: 'open', tile: 'rgb(229,247,235)' },
  ...THREE_HOURS.slice(0, 2),
];

const JOBS = [
  { id: 'A', say: 'What do I need to pay attention to in the next 3 hours?', reply: 'Three things. Your credit card payment is due today, flight check-in closes in 30 minutes, and the tax notice closes in an hour.', end: 'happy', items: THREE_HOURS },
  { id: 'B', say: 'Play some focus music.', reply: 'Playing your focus playlist.', end: 'display', items: FOCUS },
  { id: 'C', say: 'Block the next 2 hours on my calendar.', reply: 'Done. Your next 2 hours are blocked. Want me to play focus music?', end: 'puzzled', items: BLOCKED, ask: true },
];

function DeviceShell({ state, items, scale }) {
  return (
    <div style={deviceT.shell}>
      <div style={deviceT.blobA}></div><div style={deviceT.blobB}></div>
      <div style={{ position: 'relative', borderRadius: 72 * scale, overflow: 'hidden', boxShadow: '0px 11.891px 23.188px 0px rgba(0,0,0,0.08)' }}>
        <DeviceDisplay state={state} items={items} scale={scale} />
      </div>
      <div style={{ position: 'relative', transform: 'scale(.75)', height: 68, display: 'flex', alignItems: 'center' }}><AttnLogo /></div>
    </div>
  );
}

function DeviceApp() {
  const [state, setState] = React.useState('idle');
  const [items, setItems] = React.useState(THREE_HOURS);
  const [caption, setCaption] = React.useState({ who: null, text: 'Tap a command or the mic to talk to attn.' });
  const [ask, setAsk] = React.useState(false);
  const timers = React.useRef([]);
  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const run = job => {
    clear(); setAsk(false);
    setState('listening'); setCaption({ who: 'you', text: job.say });
    later(1800, () => { setState('thinking'); });
    later(3000, () => { setState('speaking'); setCaption({ who: 'attn', text: job.reply }); });
    later(5600, () => { setItems(job.items); setState(job.end); if (job.ask) setAsk(true); });
  };
  const answer = yes => { setAsk(false); if (yes) run({ ...JOBS[1], say: 'Yes, play focus music.' }); else { setState('happy'); setCaption({ who: 'attn', text: "Okay. I'll keep it quiet." }); } };
  const alert = () => { clear(); setAsk(false); setItems(THREE_HOURS); setState('alert'); setCaption({ who: 'attn', text: 'Heads up: flight check-in closes in 30 minutes.' }); };
  const reset = () => { clear(); setAsk(false); setItems(THREE_HOURS); setState('idle'); setCaption({ who: null, text: 'Tap a command or the mic to talk to attn.' }); };
  const busy = ['listening', 'thinking', 'speaking'].includes(state);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
      <DeviceShell state={state} items={items} scale={0.68} />
      <div style={{ minHeight: 56, maxWidth: 760, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {caption.who && <span style={{ font: '700 11px var(--font-action)', letterSpacing: '.06em', textTransform: 'uppercase', color: caption.who === 'attn' ? 'var(--attn-action)' : 'var(--text-tertiary)' }}>{caption.who === 'attn' ? 'attn' : 'You said'}</span>}
        <span key={caption.text} style={{ font: `${caption.who ? 600 : 400} ${caption.who ? 22 : 16}px/1.3 var(--font-brand)`, color: caption.who ? 'var(--text-primary)' : 'var(--text-secondary)', textWrap: 'pretty', animation: 'attn-fade-in var(--dur-content) var(--ease-out)' }}>{caption.who === 'you' ? `“${caption.text}”` : caption.text}</span>
      </div>
      {ask ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ ...deviceT.pill, background: 'var(--attn-action)', color: '#fff' }} onClick={() => answer(true)}>Yes, play it</button>
          <button style={{ ...deviceT.pill, background: 'var(--surface-priority)', color: '#fff' }} onClick={() => answer(false)}>Not now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
          {JOBS.map(j => (
            <button key={j.id} disabled={busy} onClick={() => run(j)} style={{ ...deviceT.pill, background: '#fff', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)', opacity: busy ? 0.5 : 1, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ font: '700 11px var(--font-action)', background: 'var(--surface-priority)', color: '#fff', borderRadius: 100, padding: '3px 7px' }}>Job {j.id}</span>{j.say}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button aria-label="Talk" disabled={busy} onClick={() => run(JOBS[0])} style={{ width: 64, height: 64, borderRadius: 100, border: 0, cursor: 'pointer', background: busy ? 'var(--attn-sky)' : 'var(--surface-priority)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-micro)' }}>
          <span style={{ width: 16, height: 26, borderRadius: 10, border: '3px solid #fff', boxSizing: 'border-box' }}></span>
        </button>
        <button onClick={alert} style={{ ...deviceT.pill, background: 'var(--status-error-background)', color: 'var(--status-action-needed)' }}>Simulate reminder</button>
        <button onClick={reset} style={{ ...deviceT.pill, background: 'transparent', color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="Refresh" size={14} />Reset</button>
      </div>
    </div>
  );
}

Object.assign(window, { DeviceApp, DeviceShell });
