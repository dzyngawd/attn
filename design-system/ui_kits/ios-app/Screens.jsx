const { PriorityCardDefault, Priority, Header, StatusBarIPhone, SettingsRowContainer, ToggleSwitch, Icon, AttnOrb } = window.AttnDesignSystem_f5a858;

const iosT = {
  screen: { width: 402, height: 852, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-brand)' },
  scroll: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
};

const SEED = [
  { id: 1, title: 'Credit card payment', sender: 'RBC Mastercard', status: 'Due Today', tone: 'red', frame: 'var(--priority-tone-blue)', icon: null },
  { id: 2, title: 'Figma edit access request', sender: 'Figma', status: '2 days ago', tone: 'open', frame: 'var(--priority-tone-green)', icon: 'UsersGroup', tile: 'rgb(28,28,30)' },
  { id: 3, title: 'Flight check-in', sender: 'Air Canada', status: 'Closes in 30mins', tone: 'red', frame: 'var(--priority-tone-orange)', icon: 'Bell', tile: 'rgb(214,40,40)' },
  { id: 4, title: 'Tax filing notice', sender: 'CRA', status: 'Closes in 1hour', tone: 'red', frame: 'var(--priority-tone-cyan)', icon: 'FileLines', tile: 'rgb(28,28,30)' },
];
const UPCOMING = [
  { id: 11, title: 'Product Design Interview', sender: 'Google meet', status: 'In 8 hours', tone: 'open', frame: 'var(--priority-tone-green)', icon: 'UsersGroup', tile: 'rgb(28,28,30)' },
  { id: 12, title: 'Reply to Robert', sender: 'Gmail', status: '20mins ago', tone: 'open', frame: 'var(--priority-tone-blue)', icon: 'Annotation', tile: 'rgb(28,28,30)' },
];

function SegTabs({ value, onChange }) {
  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ height: 56, borderRadius: 54, background: 'rgb(252,252,252)', display: 'flex', padding: '0 4px', alignItems: 'center', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}>
        {['Immediate', 'Upcoming'].map(t => (
          <button key={t} onClick={() => onChange(t)} style={{ flex: 1, height: 40, border: 0, borderRadius: 100, cursor: 'pointer', background: value === t ? '#fff' : 'transparent', boxShadow: value === t ? '0px 2px 16px 0px rgba(0,0,0,0.08)' : 'none', font: '700 16px/20px var(--font-system)', letterSpacing: '-0.23px', color: value === t ? 'rgb(0,122,255)' : 'var(--text-tertiary)', transition: 'all var(--dur-micro) var(--ease-selection)' }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

function HomeScreen({ onAccount }) {
  const [tab, setTab] = React.useState('Immediate');
  const [items, setItems] = React.useState(SEED);
  const [leaving, setLeaving] = React.useState(null);
  const list = tab === 'Immediate' ? items : UPCOMING;
  const review = id => { setLeaving(id); setTimeout(() => { setItems(x => x.filter(i => i.id !== id)); setLeaving(null); }, 320); };
  return (
    <div style={iosT.screen}>
      <StatusBarIPhone background={false} />
      <div style={{ position: 'relative' }}>
        <Header level="l1" text1="Needs attn." text2="Monday, July 20" />
        <button onClick={onAccount} aria-label="Account" style={{ position: 'absolute', right: 20, top: 24, width: 40, height: 40, borderRadius: 100, border: 0, background: 'transparent', cursor: 'pointer' }} />
      </div>
      <SegTabs value={tab} onChange={setTab} />
      <div style={{ ...iosT.scroll, padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 120, textAlign: 'center' }}>
            <AttnOrb state="idle" size={120} />
            <div style={{ font: '700 20px var(--font-brand)', color: 'var(--text-primary)' }}>You're all caught up.</div>
            <div style={{ font: '400 14px/19.6px var(--font-brand)', color: 'var(--text-secondary)', maxWidth: 240 }}>We'll keep an eye out and let you know when something needs your attention.</div>
          </div>
        )}
        {list.map(it => (
          <div key={it.id} style={{ transition: 'all var(--dur-list) var(--ease-content)', opacity: leaving === it.id ? 0 : 1, transform: leaving === it.id ? 'translateX(-40px) scale(.96)' : 'none' }}>
            <PriorityCardDefault text1={it.title} text2={it.sender}
              icon1={<Priority type={it.tone} size="lg" text1={it.status} />}
              tile={it.icon ? <Icon name={it.icon} size={28} style={{ color: '#fff' }} /> : undefined} tileColor={it.tile}
              onReviewed={() => review(it.id)} onOpen={() => {}}
              style={{ width: '100%', backgroundColor: it.frame }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BackBar({ title, onBack }) {
  return (
    <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', position: 'relative' }}>
      <button onClick={onBack} aria-label="Back" style={{ width: 44, height: 44, borderRadius: 100, border: 0, background: 'rgb(242,242,247)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="AngleLeft" size={18} style={{ color: 'var(--text-primary)' }} /></button>
      <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', font: '600 17px var(--font-brand)', color: 'var(--text-primary)', pointerEvents: 'none' }}>{title}</span>
    </div>
  );
}

function AccountScreen({ onBack, onNotifications }) {
  const [connected, setConnected] = React.useState(true);
  const rows = [['Notifications & Widget', 'Bell', onNotifications], ['App Icon', 'Grid'], ['FAQs', 'QuestionCircle'], ['Send Feedback', 'Annotation'], ['About', 'InfoCircle']];
  return (
    <div style={iosT.screen}>
      <StatusBarIPhone background={false} />
      <BackBar title="Account" onBack={onBack} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ height: 80, borderRadius: 20, background: 'var(--surface-settings)', display: 'flex', gap: 14, padding: 16, alignItems: 'center', boxSizing: 'border-box' }}>
          <div style={{ width: 48, height: 48, borderRadius: 100, overflow: 'hidden', background: 'rgb(199,148,107) url(../../assets/images/avatar-liam.png) center/cover' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: '600 18px var(--font-brand)', color: 'var(--text-primary)' }}>Liam Oliver</span>
              <span style={{ borderRadius: 100, padding: '6px 9px', font: '600 11px var(--font-action)', background: connected ? 'var(--status-connected-background)' : 'var(--status-error-background)', color: connected ? 'var(--status-connected-text)' : 'var(--status-action-needed)' }}>● {connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <span style={{ font: '400 13px var(--font-brand)', color: 'var(--text-secondary)' }}>Liamoliver@gmail.com</span>
          </div>
        </div>
      </div>
      <div style={iosT.scroll}>
        {rows.map(([t, ic, fn]) => (
          <div key={t} onClick={fn} style={{ cursor: fn ? 'pointer' : 'default' }}>
            <SettingsRowContainer text1={t} icon1={<Icon name={ic} size={16} style={{ color: 'var(--text-secondary)' }} />} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px 34px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <button onClick={() => setConnected(c => !c)} style={{ width: '100%', height: 48, borderRadius: 100, border: 0, cursor: 'pointer', background: connected ? 'var(--color-action-red)' : 'var(--attn-action)', color: '#fff', font: '600 15px var(--font-action)', transition: 'transform var(--dur-feedback) var(--ease-out)' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(.97)'} onMouseUp={e => e.currentTarget.style.transform = 'none'}>{connected ? 'Disconnect Gmail' : 'Connect Gmail'}</button>
        <span style={{ font: '400 11px/1.4 var(--font-action)', color: 'var(--text-fine-print)', textAlign: 'center', maxWidth: 260 }}>attn will stop syncing this inbox and remove its locally derived priorities.</span>
      </div>
    </div>
  );
}

function NotificationsScreen({ onBack }) {
  const [s, set] = React.useState({ widget: true, notif: true, island: true });
  const row = (k, title, sub) => (
    <div style={{ padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ flex: 1 }}><div style={{ font: '500 15px var(--font-system)', color: 'var(--text-system-primary)' }}>{title}</div><div style={{ font: '400 12px/1.4 var(--font-action)', color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div></div>
      <div onClick={() => set(x => ({ ...x, [k]: !x[k] }))} style={{ cursor: 'pointer' }}><ToggleSwitch isOn={s[k]} /></div>
    </div>
  );
  return (
    <div style={iosT.screen}>
      <StatusBarIPhone background={false} />
      <BackBar title="" onBack={onBack} />
      <div style={{ padding: '8px 20px 16px', font: '700 28px var(--font-brand)', color: 'var(--text-primary)' }}>Notifications & Widget</div>
      {row('widget', 'Home Screen Widget', 'Adding the widget to your Home Screen helps you see your top priorities without opening the app.')}
      {row('notif', 'Notifications', "attn only interrupts you when missing something could have a real consequence.")}
      {row('island', 'Dynamic Island', 'Show a countdown when a deadline is close.')}
    </div>
  );
}

Object.assign(window, { HomeScreen, AccountScreen, NotificationsScreen });
