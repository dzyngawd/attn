// figma node: 82:2272 Loading
export function Loading(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 203,
      height: 203,
      overflow: "hidden",
      borderRadius: 1000,
      backgroundColor: "var(--surface-card)",
      boxShadow: "inset 0px 1px 6.500px 0px rgba(89,89,89,0.25)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={357} height={290} viewBox="0 0 357 290" fill="none" style={{
        position: "absolute",
        left: 6,
        top: -50.5,
        width: 357,
        height: 290,
        color: "rgb(0,159,254)",
      }}>
        <path d={"M 203.92 91.629 C 203.92 173.811 143.615 137.915 47.505 164.365 C 34.313 174.441 6.422 200.638 0.392 224.821 C -5.639 249.003 59.44 278.35 92.733 290 C 137.962 284.017 247.641 255.049 324.529 187.036 C 401.418 119.023 323.901 34.007 275.532 0 C 251.661 3.149 203.92 25.883 203.92 91.629 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <svg width={357} height={290} viewBox="0 0 357 290" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "matrix(-0.991,0.135,-0.135,-0.991,202.966,195.831)",
        transformOrigin: "0 0",
        width: 357,
        height: 290,
        color: "rgb(255,214,0)",
      }}>
        <path d={"M 203.92 91.629 C 203.92 173.811 143.615 137.915 47.505 164.365 C 34.313 174.441 6.422 200.638 0.392 224.821 C -5.639 249.003 59.44 278.35 92.733 290 C 137.962 284.017 247.641 255.049 324.529 187.036 C 401.418 119.023 323.901 34.007 275.532 0 C 251.661 3.149 203.92 25.883 203.92 91.629 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <span style={{
        position: "absolute",
        left: 60,
        top: 76,
        width: 84,
        height: 51,
        fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 700,
        fontSize: 42,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--text-black)",
      }}>{props.text1 ?? "73%"}</span>
    </div>
  );
}
export default Loading;
