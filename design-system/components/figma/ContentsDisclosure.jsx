// figma node: 24:552 _Contents/Disclosure (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "disclosed=" + __venc(p.disclosed);

export function ContentsDisclosure(_p = {}) {
  const props = { ..._p, disclosed: _p.disclosed ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 8,
      height: 32,
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: -3,
        top: 7,
        width: 11,
        height: 18,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 590,
        fontSize: 17,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "25px",
        color: "var(--accents-blue)",
      }}>{props.text1 ?? "􀆊"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 8,
      height: 32,
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: -3,
        top: 7,
        width: 11,
        height: 18,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 590,
        fontSize: 17,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "25px",
        color: "var(--accents-blue)",
      }}>{props.text1 ?? "􀆈"}</span>
    </div>
  );
  const __impls = {
    // figma: Disclosed=False
    "disclosed=false": __body0,
    // figma: Disclosed=True
    "disclosed=true": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default ContentsDisclosure;
