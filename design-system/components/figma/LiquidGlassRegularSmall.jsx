// figma node: 24:19 Liquid Glass - Regular - Small (8 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "mode=" + __venc(p.mode) + '|' + "active=" + __venc(p.active) + '|' + "prominent=" + __venc(p.prominent);

export function LiquidGlassRegularSmall(_p = {}) {
  const props = { ..._p, mode: _p.mode ?? "light", active: _p.active ?? true, prominent: _p.prominent ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 100,
      backgroundColor: "rgba(118,118,128,0.24)",
      boxShadow: "0px 0px 0px 0.500px rgb(230,230,230)",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 100,
      backgroundColor: "rgba(116,116,128,0.08)",
      boxShadow: "0px 0px 0px 0.500px rgb(235,235,235)",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 48,
      height: 48,
      position: "relative",
      ...props.style,
    }}>
      <svg width={49} height={49} viewBox="0 0 49 49" fill="none" style={{
        position: "absolute",
        left: -0.5,
        top: -0.5,
        width: 49,
        height: 49,
        opacity: 0.94,
        overflow: "hidden",
        borderRadius: 1000,
        color: "rgb(255,255,255)",
      }}>
        <path d={"M 0 24.5 C 0 10.969 10.969 0 24.5 0 L 24.5 0 C 38.031 0 49 10.969 49 24.5 L 49 24.5 C 49 38.031 38.031 49 24.5 49 L 24.5 49 C 10.969 49 0 38.031 0 24.5 L 0 24.5 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <svg width={49} height={49} viewBox="0 0 49 49" fill="none" style={{
        position: "absolute",
        left: -0.5,
        top: -0.5,
        width: 49,
        height: 49,
        overflow: "hidden",
        borderRadius: 1000,
        color: "var(--accents-blue)",
      }}>
        <path d={"M 0 24.5 C 0 10.969 10.969 0 24.5 0 L 24.5 0 C 38.031 0 49 10.969 49 24.5 L 49 24.5 C 49 38.031 38.031 49 24.5 49 L 24.5 49 C 10.969 49 0 38.031 0 24.5 L 0 24.5 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 48,
      height: 48,
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 1000,
        filter: "drop-shadow(0px 0px 0.500px rgb(166,166,166)) drop-shadow(0px 8px 15px rgba(0,0,0,0.04))",
        color: "rgba(153,153,153,0.17)",
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 48,
      height: 48,
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 1000,
        filter: "drop-shadow(0px 0px 0.500px rgb(232,232,232)) drop-shadow(0px 8px 15px rgba(0,0,0,0.02))",
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __impls = {
    // figma: Mode=Dark, Active=False, Prominent=False
    "mode=dark|active=false|prominent=false": __body0,
    // figma: Mode=Light, Active=False, Prominent=False
    "mode=light|active=false|prominent=false": __body1,
    // figma: Mode=Dark, Active=False, Prominent=True
    "mode=dark|active=false|prominent=true": __body0,
    // figma: Mode=Light, Active=False, Prominent=True
    "mode=light|active=false|prominent=true": __body1,
    // figma: Mode=Dark, Active=True, Prominent=True
    "mode=dark|active=true|prominent=true": __body2,
    // figma: Mode=Light, Active=True, Prominent=True
    "mode=light|active=true|prominent=true": __body2,
    // figma: Mode=Dark, Active=True, Prominent=False
    "mode=dark|active=true|prominent=false": __body3,
    // figma: Mode=Light, Active=True, Prominent=False
    "mode=light|active=true|prominent=false": __body4,
  };
  return (__impls[__vkey(props)] ?? __body4)();
}
export default LiquidGlassRegularSmall;
