// figma node: 24:426 _Separator (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "mode=" + __venc(p.mode);

export function Separator(_p = {}) {
  const props = { ..._p, mode: _p.mode ?? "light" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 370,
      height: 1,
      borderTop: "1px solid rgb(26,26,26)",
      borderRight: "1px solid rgb(26,26,26)",
      borderBottom: "1px solid rgb(26,26,26)",
      borderLeft: "1px solid rgb(26,26,26)",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 370,
      height: 1,
      borderTop: "1px solid var(--separators-vibrant)",
      borderRight: "1px solid var(--separators-vibrant)",
      borderBottom: "1px solid var(--separators-vibrant)",
      borderLeft: "1px solid var(--separators-vibrant)",
      position: "relative",
      ...props.style,
    }} />
  );
  const __impls = {
    // figma: Mode=Dark
    "mode=dark": __body0,
    // figma: Mode=Light
    "mode=light": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Separator;
