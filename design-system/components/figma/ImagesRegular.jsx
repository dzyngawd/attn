// figma node: 24:585 _Images/Regular (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type);

export function ImagesRegular(_p = {}) {
  const props = { ..._p, type: _p.type ?? "fill" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "20px",
        color: "var(--accents-blue)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text1 ?? "􀋂"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: 30,
        borderRadius: 7,
        backgroundColor: "var(--accents-blue)",
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
    </div>
  );
  const __body2 = () => (
    <div className={"fig-asset-7f12ea1300756f14 " + (props.className || '')} style={{
      width: 42,
      height: 42,
      borderRadius: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body3 = () => (
    <div className={"fig-asset-7f12ea1300756f14 " + (props.className || '')} style={{
      width: 52,
      height: 52,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __impls = {
    // figma: Type=Symbol
    "type=symbol": __body0,
    // figma: Type=Rounded
    "type=rounded": __body1,
    // figma: Type=Circular
    "type=circular": __body2,
    // figma: Type=Fill
    "type=fill": __body3,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default ImagesRegular;
