const { ToggleSwitch, Icon, AttnLogo, AttnOrb, DeviceDisplay, CheckboxInput, Loading } = window.AttnDesignSystem_f5a858;

const webT = {
  page: { minHeight: '100vh', background: 'var(--surface-canvas)', fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' },
  top: { height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', maxWidth: 1120, margin: '0 auto' },
  wrap: { maxWidth: 1120, margin: '0 auto', padding: '8px 32px 64px', display: 'grid', gridTemplateColumns: 'minmax(0,240px) minmax(0,1fr)', gap: 32 },
  panel: { background: 'var(--surface-card)', borderRadius: 'var(--r-card)', padding: 'var(--sp-section)', boxShadow: 'var(--shadow-card)' },
  h1: { font: '700 28px/1.1 var(--font-brand)', margin: 0 },
  sub: { font: '400 14px/19.6px var(--font-brand)', color: 'var(--text-secondary)', margin: '8px 0 0', textWrap: 'pretty' },
  pill: { border: 0, borderRadius: 100, padding: '10px 16px', font: '600 13px var(--font-action)', cursor: 'pointer', transition: 'transform var(--dur-feedback) var(--ease-out)' },
};

const SOURCES = [
  { id: 'gmail', name: 'Gmail', note: 'Bills, deadlines, requests that need a reply', icon: 'Annotation', tone: 'var(--priority-tone-blue)', on: true },
  { id: 'cal', name: 'Calendar', note: 'Meetings, flights, anything with a start time', icon: 'Grid', tone: 'var(--priority-tone-orange)', on: true },
  { id: 'tasks', name: 'Tasks', note: 'Items with due dates', icon: 'Check', tone: 'var(--priority-tone-green)', on: false },
  { id: 'notes', name: 'Notes', note: 'Reminders you wrote to yourself', icon: 'BookOpen', tone: 'var(--priority-tone-cyan)', on: false },
];

function StatusPill({ on }) {
  return <span style={{ borderRadius: 100, padding: '6px 9px', font: '600 11px var(--font-action)', whiteSpace: 'nowrap', background: on ? 'var(--status-connected-background)' : 'var(--surface-subtle)', color: on ? 'var(--status-connected-text)' : 'var(--text-tertiary)' }}>● {on ? 'Connected' : 'Not connected'}</span>;
}

function SourcesView() {
  const [src, setSrc] = React.useState(SOURCES);
  const [busy, setBusy] = React.useState(null);
  const toggle = id => {
    const s = src.find(x => x.id === id);
    if (!s.on) { setBusy(id); setTimeout(() => { setBusy(null); setSrc(l => l.map(x => x.id === id ? { ...x, on: true } : x)); }, 1400); }
    else setSrc(l => l.map(x => x.id === id ? { ...x, on: false } : x));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h1 style={webT.h1}>Sources</h1><p style={webT.sub}>Choose what attn can read. It only surfaces what needs your attention, and nothing leaves your account.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {src.map(s => (
          <div key={s.id} style={{ ...webT.panel, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.tone, boxShadow: 'var(--shadow-bevel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={22} style={{ color: 'var(--text-primary)' }} /></div>
              <StatusPill on={s.on} />
            </div>
            <div><div style={{ font: '600 18px var(--font-brand)' }}>{s.name}</div><div style={{ font: '400 13px/1.4 var(--font-brand)', color: 'var(--text-secondary)', marginTop: 4 }}>{s.note}</div></div>
            <button onClick={() => toggle(s.id)} style={{ ...webT.pill, alignSelf: 'flex-start', background: s.on ? 'var(--surface-subtle)' : 'var(--attn-action)', color: s.on ? 'var(--text-primary)' : '#fff' }}>{busy === s.id ? 'Connecting…' : s.on ? 'Disconnect' : `Connect ${s.name}`}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesView() {
  const [r, setR] = React.useState({ money: true, travel: true, replies: true, promos: false });
  const rows = [['money', 'Payments & bills', 'Due dates and overdue notices'], ['travel', 'Travel', 'Check-in windows, gate changes'], ['replies', 'People waiting on you', 'Direct requests older than a day'], ['promos', 'Newsletters & promos', 'Usually safe to ignore']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h1 style={webT.h1}>What deserves attn.</h1><p style={webT.sub}>attn uses these to decide what reaches your device.</p></div>
      <div style={{ ...webT.panel, padding: 0, overflow: 'hidden' }}>
        {rows.map(([k, t, s], i) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderTop: i ? '1px solid var(--line-system-light)' : 0 }}>
            <div style={{ flex: 1 }}><div style={{ font: '500 15px var(--font-system)', color: 'var(--text-system-primary)' }}>{t}</div><div style={{ font: '400 12px var(--font-action)', color: 'var(--text-secondary)', marginTop: 4 }}>{s}</div></div>
            <div style={{ cursor: 'pointer' }} onClick={() => setR(x => ({ ...x, [k]: !x[k] }))}><ToggleSwitch isOn={r[k]} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceView() {
  const [state, setState] = React.useState('display');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><h1 style={webT.h1}>Your device</h1><p style={webT.sub}>Preview what attn shows on the device right now.</p></div>
      <div style={{ ...webT.panel, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <DeviceDisplay state={state} scale={0.5} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['idle', 'display', 'listening', 'thinking', 'speaking', 'alert'].map(s => (
            <button key={s} onClick={() => setState(s)} style={{ ...webT.pill, background: state === s ? 'var(--surface-priority)' : 'var(--surface-subtle)', color: state === s ? '#fff' : 'var(--text-primary)' }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OnboardingView({ onDone }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); setTimeout(onDone, 500); return 100; } return p + 3; }), 60); return () => clearInterval(t); }, []);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--grad-sky-screen)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, textAlign: 'center', padding: 24 }}>
      <AttnOrb state="thinking" size={203} label={`${Math.min(pct, 100)}%`} />
      <div style={{ font: '400 14px/19.6px var(--font-brand)', color: 'var(--text-secondary)', maxWidth: 280 }}>Analyzing your inbox & finding the few messages that deserve your attention.</div>
    </div>
  );
}

function WebApp() {
  const [view, setView] = React.useState('onboarding');
  if (view === 'onboarding') return <OnboardingView onDone={() => setView('sources')} />;
  const nav = [['sources', 'Sources', 'ShareNodes'], ['rules', 'Rules', 'AdjustmentsVertical'], ['device', 'Device', 'Grid'], ['account', 'Account', 'UsersGroup']];
  return (
    <div style={webT.page}>
      <div style={webT.top}>
        <div style={{ transform: 'scale(.4)', transformOrigin: '0 50%', width: 80, height: 40, display: 'flex', alignItems: 'center' }}><AttnLogo /></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ font: '500 13px var(--font-action)', color: 'var(--text-secondary)' }}>Liamoliver@gmail.com</span>
          <div style={{ width: 36, height: 36, borderRadius: 100, background: 'rgb(199,148,107) url(../../assets/images/avatar-liam.png) center/cover' }} />
        </div>
      </div>
      <div style={webT.wrap}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(([k, t, ic]) => (
            <button key={k} onClick={() => setView(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: 0, borderRadius: 'var(--r-medium)', cursor: 'pointer', textAlign: 'left', background: view === k ? 'var(--surface-card)' : 'transparent', boxShadow: view === k ? 'var(--shadow-card)' : 'none', font: `${view === k ? 600 : 500} 15px var(--font-brand)`, color: 'var(--text-primary)', transition: 'background var(--dur-micro)' }}>
              <Icon name={ic} size={16} style={{ color: view === k ? 'var(--attn-action)' : 'var(--text-tertiary)' }} />{t}
            </button>
          ))}
        </nav>
        <main>
          {view === 'sources' && <SourcesView />}
          {view === 'rules' && <RulesView />}
          {view === 'device' && <DeviceView />}
          {view === 'account' && <div><h1 style={webT.h1}>Account</h1><p style={webT.sub}>Intentionally blank. Not defined in the source Figma yet.</p></div>}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { WebApp });
