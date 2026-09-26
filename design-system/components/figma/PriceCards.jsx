// figma node: 106:3464 Price Cards (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1);

export function PriceCards(_p = {}) {
  const props = { ..._p, amount: _p.amount ?? "", property1: _p.property1 ?? "default", type: _p.type ?? "", tag: _p.tag ?? false, subtext: _p.subtext ?? "" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 357,
      overflow: "hidden",
      borderRadius: 28,
      backgroundColor: "var(--surface-card)",
      boxShadow: "inset -2px 2px 1px 0px rgba(255,255,255,0.3137), 0px 12px 24px 0px rgba(0,0,0,0.0314)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-content) * 1px)",
      padding: "20px 20px 20px 20px",
      justifyContent: "center",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-panel) * 1px)",
      paddingTop: "calc(var(--space-panel) * 1px)",
      paddingRight: "calc(var(--space-panel) * 1px)",
      paddingBottom: "calc(var(--space-panel) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-compact) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 500,
            fontSize: "calc(var(--size-body-2) * 1px)",
            whiteSpace: "nowrap",
            lineHeight: "100%",
            color: "var(--text-system-primary)",
            flexShrink: 0,
          }}>{props.text1 ?? "Yearly"}</span>
        </div>
        <div style={{
          position: "relative",
          width: 20,
          height: 20,
          borderRadius: 10,
          boxShadow: "inset 0 0 0 2px var(--accent-selection)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "var(--accent-selection)",
            flexShrink: 0,
          }} />
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--space-compact) * 1px)",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-content) * 1px)",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "flex-end",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: "calc(var(--size-price) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-system-primary)",
              flexShrink: 0,
            }}>{props.text2 ?? "$12.99"}</span>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: "calc(var(--size-caption) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-price-secondary)",
              flexShrink: 0,
            }}>{props.text3 ?? "/year"}</span>
          </div>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: "calc(var(--size-body-2) * 1px)",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--text-muted)",
          flexShrink: 0,
        }}>{props.text4 ?? "That's $8.33/month"}</span>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 357,
      overflow: "hidden",
      borderRadius: 28,
      backgroundColor: "var(--surface-card)",
      boxShadow: "inset -2px 2px 1px 0px rgba(255,255,255,0.3137), 0px 12px 24px 0px rgba(0,0,0,0.0314)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-content) * 1px)",
      padding: "20px 20px 20px 20px",
      justifyContent: "center",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-panel) * 1px)",
      paddingTop: "calc(var(--space-panel) * 1px)",
      paddingRight: "calc(var(--space-panel) * 1px)",
      paddingBottom: "calc(var(--space-panel) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-compact) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 500,
            fontSize: "calc(var(--size-body-2) * 1px)",
            whiteSpace: "nowrap",
            lineHeight: "100%",
            color: "var(--text-system-primary)",
            flexShrink: 0,
          }}>{props.text1 ?? "Yearly"}</span>
        </div>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{
          position: "relative",
          width: 20,
          height: 20,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          color: "rgb(209,213,219)",
        }}>
          <path d={"M 0 10 M 20 10 M 20 10 M 0 10 M 10 0 M 20 10 M 10 20 M 0 10 M 10 20 L 10 18 C 5.582 18 2 14.418 2 10 L 0 10 L -2 10 C -2 16.627 3.373 22 10 22 L 10 20 Z M 20 10 L 18 10 C 18 14.418 14.418 18 10 18 L 10 20 L 10 22 C 16.627 22 22 16.627 22 10 L 20 10 Z M 10 0 L 10 2 C 14.418 2 18 5.582 18 10 L 20 10 L 22 10 C 22 3.373 16.627 -2 10 -2 L 10 0 Z M 10 0 L 10 -2 C 3.373 -2 -2 3.373 -2 10 L 0 10 L 2 10 C 2 5.582 5.582 2 10 2 L 10 0 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--space-compact) * 1px)",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-content) * 1px)",
          justifyContent: "center",
          alignItems: "flex-end",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "flex-end",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: "calc(var(--size-price) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-system-primary)",
              flexShrink: 0,
            }}>{props.text2 ?? "$12.99"}</span>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: "calc(var(--size-caption) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-price-secondary)",
              flexShrink: 0,
            }}>{props.text3 ?? "/month"}</span>
          </div>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: "calc(var(--size-body-2) * 1px)",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--text-muted)",
          flexShrink: 0,
        }}>{props.text4 ?? "That's $8.33/month"}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: Property 1=Selected
    "property1=selected": __body0,
    // figma: Property 1=Default
    "property1=default": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default PriceCards;
