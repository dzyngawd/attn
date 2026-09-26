// figma node: 24:480 _Decrement (3 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "style2=" + __venc(p.style2);

export function Decrement(_p = {}) {
  const props = { ..._p, style2: _p.style2 ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 46,
      height: 32,
      borderRadius: "100px 0px 0px 100px",
      backgroundColor: "rgba(116,116,128,0.08)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        top: 5,
        width: 46,
        height: 22,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 590,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.430px",
        color: "rgba(60,60,67,0.3)",
      }}>{props.text1 ?? "􀅽"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 46,
      height: 32,
      borderRadius: "100px 0px 0px 100px",
      background: "linear-gradient(rgba(0,0,0,0.08),rgba(0,0,0,0.08)), linear-gradient(rgba(116,116,128,0.08),rgba(116,116,128,0.08))",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        top: 5,
        width: 46,
        height: 22,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 590,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.430px",
        color: "var(--labels-primary)",
      }}>{props.text1 ?? "􀅽"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 46,
      height: 32,
      borderRadius: "100px 0px 0px 100px",
      backgroundColor: "rgba(116,116,128,0.08)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        top: 5,
        width: 46,
        height: 22,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 590,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.430px",
        color: "var(--labels-primary)",
      }}>{props.text1 ?? "􀅽"}</span>
    </div>
  );
  const __impls = {
    // figma: Style=Disabled
    "style2=disabled": __body0,
    // figma: Style=Pressed
    "style2=pressed": __body1,
    // figma: Style=Default
    "style2=default": __body2,
  };
  return (__impls[__vkey(props)] ?? __body2)();
}
export default Decrement;
