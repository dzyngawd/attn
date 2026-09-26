// figma node: 112:5581 Widget items (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1);

export function WidgetItems(_p = {}) {
  const props = { ..._p, header: _p.header ?? "", property1: _p.property1 ?? "extra large", emoji: _p.emoji ?? "" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 290.5,
      borderRadius: 24,
      backgroundColor: "var(--surface-widget)",
      boxShadow: "0px 4px 7.800px 0px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-content) * 1px)",
      padding: "8px 16px 8px 8px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-compact) * 1px)",
      paddingTop: "calc(var(--space-compact) * 1px)",
      paddingRight: "calc(var(--space-content) * 1px)",
      paddingBottom: "calc(var(--space-compact) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--space-row) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          width: 64,
          height: 64,
          overflow: "hidden",
          borderRadius: 17.066667556762695,
          backgroundColor: props.tileColor ?? "rgb(217,236,255)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 600,
            fontSize: "calc(var(--size-widget-symbol) * 1px)",
            whiteSpace: "nowrap",
            lineHeight: "100%",
            color: "var(--text-primary)",
            flexShrink: 0,
          }}>{props.text1 ?? "$"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-compact) * 1px)",
          alignItems: "flex-end",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 600,
              fontSize: "calc(var(--size-headline-2) * 1px)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "100%",
              color: "var(--text-on-dark)",
              flexShrink: 0,
            }}>{props.text2 ?? "Credit card payment"}</span>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: "calc(var(--space-control) * 1px)",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 600,
                fontSize: "calc(var(--size-body-2) * 1px)",
                whiteSpace: "nowrap",
                lineHeight: "100%",
                color: props.statusTone === "open" ? "var(--text-subtle)" : "var(--status-action-needed)",
                flexShrink: 0,
              }}>{props.status ?? "Due Today"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 290.5,
      borderRadius: 16,
      backgroundColor: "var(--surface-widget)",
      boxShadow: "0px 4px 7.800px 0px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-content) * 1px)",
      padding: "16px 16px 16px 16px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-content) * 1px)",
      paddingTop: "calc(var(--space-content) * 1px)",
      paddingRight: "calc(var(--space-content) * 1px)",
      paddingBottom: "calc(var(--space-content) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--space-compact) * 1px)",
        alignItems: "flex-end",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 600,
            fontSize: "calc(var(--size-caption) * 1px)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "100%",
            color: "var(--text-on-dark)",
            flexShrink: 0,
          }}>{props.text1 ?? "Credit card payment"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 600,
              fontSize: "calc(var(--size-caption) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: props.statusTone === "red" ? "var(--status-action-needed)" : "var(--text-subtle)",
              flexShrink: 0,
            }}>{props.status ?? "Closes in 5 hours"}</span>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Property 1=Extra large
    "property1=extra large": __body0,
    // figma: Property 1=Large
    "property1=large": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default WidgetItems;
