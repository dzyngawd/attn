// figma node: 24:513 Toggle - Switch (8 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "isOn=" + __venc(p.isOn) + '|' + "isEnabled=" + __venc(p.isEnabled);

export function ToggleSwitch(_p = {}) {
  const props = { ..._p, showAXLabel: _p.showAXLabel ?? false, state: _p.state ?? "idle", isOn: _p.isOn ?? true, isEnabled: _p.isEnabled ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      opacity: 0.5,
      borderRadius: 100,
      backgroundColor: "rgba(60,60,67,0.3)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={38} height={24} viewBox="0 0 38 24" fill="none" style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 38,
        height: 24,
        borderRadius: 100,
        color: "rgb(255,255,255)",
      }}>
        <path d={"M 0 12 C 0 5.373 5.373 0 12 0 L 26 0 C 32.627 0 38 5.373 38 12 L 38 12 C 38 18.627 32.627 24 26 24 L 12 24 C 5.373 24 0 18.627 0 12 L 0 12 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "absolute",
        left: 41,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 10,
          height: 10,
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1px var(--miscellaneous-toggle-ax-label-off)",
          flexShrink: 0,
        }} />
        )}
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      opacity: 0.5,
      borderRadius: 100,
      backgroundColor: "var(--accents-green)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 2,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 1,
          height: 10,
          backgroundColor: "rgb(255,255,255)",
          flexShrink: 0,
        }} />
        )}
      </div>
      <svg width={38} height={24} viewBox="0 0 38 24" fill="none" style={{
        position: "absolute",
        left: 24,
        top: 2,
        width: 38,
        height: 24,
        borderRadius: 100,
        color: "rgb(255,255,255)",
      }}>
        <path d={"M 0 12 C 0 5.373 5.373 0 12 0 L 26 0 C 32.627 0 38 5.373 38 12 L 38 12 C 38 18.627 32.627 24 26 24 L 12 24 C 5.373 24 0 18.627 0 12 L 0 12 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      borderRadius: 100,
      backgroundColor: "rgba(60,60,67,0.3)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 41,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 10,
          height: 10,
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1px var(--miscellaneous-toggle-ax-label-off)",
          flexShrink: 0,
        }} />
        )}
      </div>
      <div style={{
        position: "absolute",
        left: -8,
        top: -5,
        width: 58,
        height: 38,
        borderRadius: 100,
      }}>
        <svg width={58} height={38} viewBox="0 0 58 38" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 7,
          width: 58,
          height: 38,
          opacity: 0.5,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(0,0,0)",
        }}>
          <path d={"M 19 0 L 19 1 L 39 1 L 39 0 L 39 -1 L 19 -1 L 19 0 Z M 39 38 L 39 37 L 19 37 L 19 38 L 19 39 L 39 39 L 39 38 Z M 19 38 L 19 37 C 9.059 37 1 28.941 1 19 L 0 19 L -1 19 C -1 30.046 7.954 39 19 39 L 19 38 Z M 58 19 L 57 19 C 57 28.941 48.941 37 39 37 L 39 38 L 39 39 C 50.046 39 59 30.046 59 19 L 58 19 Z M 39 0 L 39 1 C 48.941 1 57 9.059 57 19 L 58 19 L 59 19 C 59 7.954 50.046 -1 39 -1 L 39 0 Z M 19 0 L 19 -1 C 7.954 -1 -1 7.954 -1 19 L 0 19 L 1 19 C 1 9.059 9.059 1 19 1 L 19 0 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={60} height={40} viewBox="0 0 60 40" fill="none" style={{
          position: "absolute",
          left: -1,
          top: -1,
          width: 60,
          height: 40,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgba(255,255,255,0.09)",
        }}>
          <path d={"M 0 20 C 0 8.954 8.954 0 20 0 L 40 0 C 51.046 0 60 8.954 60 20 L 60 20 C 60 31.046 51.046 40 40 40 L 20 40 C 8.954 40 0 31.046 0 20 L 0 20 Z"} fill="rgba(255,255,255,0.09)" fillRule="nonzero" />
          <path d={"M 20 0 L 20 0.5 L 40 0.5 L 40 0 L 40 -0.5 L 20 -0.5 L 20 0 Z M 40 40 L 40 39.5 L 20 39.5 L 20 40 L 20 40.5 L 40 40.5 L 40 40 Z M 20 40 L 20 39.5 C 9.23 39.5 0.5 30.77 0.5 20 L 0 20 L -0.5 20 C -0.5 31.322 8.678 40.5 20 40.5 L 20 40 Z M 60 20 L 59.5 20 C 59.5 30.77 50.77 39.5 40 39.5 L 40 40 L 40 40.5 C 51.322 40.5 60.5 31.322 60.5 20 L 60 20 Z M 40 0 L 40 0.5 C 50.77 0.5 59.5 9.23 59.5 20 L 60 20 L 60.5 20 C 60.5 8.678 51.322 -0.5 40 -0.5 L 40 0 Z M 20 0 L 20 -0.5 C 8.678 -0.5 -0.5 8.678 -0.5 20 L 0 20 L 0.5 20 C 0.5 9.23 9.23 0.5 20 0.5 L 20 0 Z"} fill="rgb(204,204,204)" fillRule="nonzero" />
        </svg>
        <svg width={58} height={38} viewBox="0 0 58 38" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 58,
          height: 38,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 19 C 0 8.507 8.507 0 19 0 L 39 0 C 49.493 0 58 8.507 58 19 L 58 19 C 58 29.493 49.493 38 39 38 L 19 38 C 8.507 38 0 29.493 0 19 L 0 19 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--accents-green)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 2,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 1,
          height: 10,
          backgroundColor: "rgb(255,255,255)",
          flexShrink: 0,
        }} />
        )}
      </div>
      <div style={{
        position: "absolute",
        left: 14,
        top: -5,
        width: 58,
        height: 38,
        borderRadius: 100,
      }}>
        <svg width={58} height={38} viewBox="0 0 58 38" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 7,
          width: 58,
          height: 38,
          opacity: 0.5,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(0,0,0)",
        }}>
          <path d={"M 19 0 L 19 1 L 39 1 L 39 0 L 39 -1 L 19 -1 L 19 0 Z M 39 38 L 39 37 L 19 37 L 19 38 L 19 39 L 39 39 L 39 38 Z M 19 38 L 19 37 C 9.059 37 1 28.941 1 19 L 0 19 L -1 19 C -1 30.046 7.954 39 19 39 L 19 38 Z M 58 19 L 57 19 C 57 28.941 48.941 37 39 37 L 39 38 L 39 39 C 50.046 39 59 30.046 59 19 L 58 19 Z M 39 0 L 39 1 C 48.941 1 57 9.059 57 19 L 58 19 L 59 19 C 59 7.954 50.046 -1 39 -1 L 39 0 Z M 19 0 L 19 -1 C 7.954 -1 -1 7.954 -1 19 L 0 19 L 1 19 C 1 9.059 9.059 1 19 1 L 19 0 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={60} height={40} viewBox="0 0 60 40" fill="none" style={{
          position: "absolute",
          left: -1,
          top: -1,
          width: 60,
          height: 40,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgba(255,255,255,0.09)",
        }}>
          <path d={"M 0 20 C 0 8.954 8.954 0 20 0 L 40 0 C 51.046 0 60 8.954 60 20 L 60 20 C 60 31.046 51.046 40 40 40 L 20 40 C 8.954 40 0 31.046 0 20 L 0 20 Z"} fill="rgba(255,255,255,0.09)" fillRule="nonzero" />
          <path d={"M 20 0 L 20 0.5 L 40 0.5 L 40 0 L 40 -0.5 L 20 -0.5 L 20 0 Z M 40 40 L 40 39.5 L 20 39.5 L 20 40 L 20 40.5 L 40 40.5 L 40 40 Z M 20 40 L 20 39.5 C 9.23 39.5 0.5 30.77 0.5 20 L 0 20 L -0.5 20 C -0.5 31.322 8.678 40.5 20 40.5 L 20 40 Z M 60 20 L 59.5 20 C 59.5 30.77 50.77 39.5 40 39.5 L 40 40 L 40 40.5 C 51.322 40.5 60.5 31.322 60.5 20 L 60 20 Z M 40 0 L 40 0.5 C 50.77 0.5 59.5 9.23 59.5 20 L 60 20 L 60.5 20 C 60.5 8.678 51.322 -0.5 40 -0.5 L 40 0 Z M 20 0 L 20 -0.5 C 8.678 -0.5 -0.5 8.678 -0.5 20 L 0 20 L 0.5 20 C 0.5 9.23 9.23 0.5 20 0.5 L 20 0 Z"} fill="rgb(204,204,204)" fillRule="nonzero" />
        </svg>
        <svg width={58} height={38} viewBox="0 0 58 38" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 58,
          height: 38,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 19 C 0 8.507 8.507 0 19 0 L 39 0 C 49.493 0 58 8.507 58 19 L 58 19 C 58 29.493 49.493 38 39 38 L 19 38 C 8.507 38 0 29.493 0 19 L 0 19 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      borderRadius: 100,
      backgroundColor: "rgba(60,60,67,0.3)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={38} height={24} viewBox="0 0 38 24" fill="none" style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 38,
        height: 24,
        borderRadius: 100,
        color: "rgb(255,255,255)",
      }}>
        <path d={"M 0 12 C 0 5.373 5.373 0 12 0 L 26 0 C 32.627 0 38 5.373 38 12 L 38 12 C 38 18.627 32.627 24 26 24 L 12 24 C 5.373 24 0 18.627 0 12 L 0 12 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "absolute",
        left: 41,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 10,
          height: 10,
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1px var(--miscellaneous-toggle-ax-label-off)",
          flexShrink: 0,
        }} />
        )}
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 64,
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--accents-green)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 2,
        top: 9,
        width: 21,
        height: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        {props.showAXLabel && (
        <div style={{
          position: "relative",
          width: 1,
          height: 10,
          backgroundColor: "rgb(255,255,255)",
          flexShrink: 0,
        }} />
        )}
      </div>
      <svg width={38} height={24} viewBox="0 0 38 24" fill="none" style={{
        position: "absolute",
        left: 24,
        top: 2,
        width: 38,
        height: 24,
        borderRadius: 100,
        color: "rgb(255,255,255)",
      }}>
        <path d={"M 0 12 C 0 5.373 5.373 0 12 0 L 26 0 C 32.627 0 38 5.373 38 12 L 38 12 C 38 18.627 32.627 24 26 24 L 12 24 C 5.373 24 0 18.627 0 12 L 0 12 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __impls = {
    // figma: State=Idle, Is On=False, Is Enabled=False
    "state=idle|isOn=false|isEnabled=false": __body0,
    // figma: State=Pressed, Is On=False, Is Enabled=False
    "state=pressed|isOn=false|isEnabled=false": __body0,
    // figma: State=Idle, Is On=True, Is Enabled=False
    "state=idle|isOn=true|isEnabled=false": __body1,
    // figma: State=Pressed, Is On=True, Is Enabled=False
    "state=pressed|isOn=true|isEnabled=false": __body1,
    // figma: State=Pressed, Is On=False, Is Enabled=True
    "state=pressed|isOn=false|isEnabled=true": __body2,
    // figma: State=Pressed, Is On=True, Is Enabled=True
    "state=pressed|isOn=true|isEnabled=true": __body3,
    // figma: State=Idle, Is On=False, Is Enabled=True
    "state=idle|isOn=false|isEnabled=true": __body4,
    // figma: State=Idle, Is On=True, Is Enabled=True
    "state=idle|isOn=true|isEnabled=true": __body5,
  };
  return (__impls[__vkey(props)] ?? __body5)();
}
export default ToggleSwitch;
