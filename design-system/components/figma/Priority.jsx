// figma node: 74:1370 Priority (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + '|' + "size=" + __venc(p.size);

export function Priority(_p = {}) {
  const props = { ..._p, type: _p.type ?? "open", size: _p.size ?? "sm" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--space-control) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: "calc(var(--size-body-2) * 1px)",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--text-subtle)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text1 ?? "Closes in 5 hours"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--space-control) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: "calc(var(--size-caption) * 1px)",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--text-subtle)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text1 ?? "Closes in 5 hours"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--space-control) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: "calc(var(--size-body-2) * 1px)",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--status-action-needed)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text1 ?? "Due Today"}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--space-control) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: "calc(var(--size-caption) * 1px)",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--status-action-needed)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text1 ?? "Due Today"}</span>
    </div>
  );
  const __impls = {
    // figma: Type=Open, Size=Large
    "type=open|size=lg": __body0,
    // figma: Type=Open, Size=Small
    "type=open|size=sm": __body1,
    // figma: Type=Red, Size=Large
    "type=red|size=lg": __body2,
    // figma: Type=Red, Size=Small
    "type=red|size=sm": __body3,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Priority;
