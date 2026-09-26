import { Priority } from './Priority.jsx';

// figma node: 74:1326 PriorityCard/Default
export function PriorityCardDefault(_p = {}) {
  const props = { ..._p, header: _p.header ?? "", sender: _p.sender ?? "" };
  return (
    <div className={props.className} style={{
      width: 362,
      overflow: "hidden",
      borderRadius: 28,
      backgroundColor: "var(--priority-tone-blue)",
      boxShadow: "inset -2px 2px 1.300px 0px rgba(255,255,255,0.36), inset 0px -2px 1px 0px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-card) * 1px)",
      padding: "12px 12px 12px 12px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-card) * 1px)",
      paddingTop: "calc(var(--space-card) * 1px)",
      paddingRight: "calc(var(--space-card) * 1px)",
      paddingBottom: "calc(var(--space-card) * 1px)",
      position: "relative",
      color: "rgb(16,16,18)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: -30,
        top: -52,
        width: 188,
        height: 188,
        borderRadius: "50%",
        backgroundColor: "var(--surface-card)",
      }} />
      <div style={{
        position: "absolute",
        left: 240,
        top: 66,
        width: 188,
        height: 188,
        borderRadius: "50%",
        backgroundColor: "var(--surface-card)",
      }} />
      <div style={{
        position: "relative",
        borderRadius: 24,
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
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--space-row) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 64,
            height: 64,
            overflow: "hidden",
            borderRadius: 17.066667556762695,
            backgroundColor: props.tileColor ?? "rgb(19,94,171)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            {props.tile ?? <div className="fig-asset-73b8d25c64595bf8" style={{
              position: "relative",
              width: 38.4,
              height: 50.477,
              flexShrink: 0,
            }} />}
          </div>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--space-compact) * 1px)",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 3,
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
                lineHeight: "100%",
                color: "var(--text-on-dark)",
                flexShrink: 0,
              }}>{props.text1 ?? "Credit card payment"}</span>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon1 ?? <Priority type={"red"} size={"lg"} />}</div>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: "calc(var(--size-caption) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-on-dark-tertiary)",
              flexShrink: 0,
            }}>{props.text2 ?? "RBC Mastercard"}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--space-compact) * 1px)",
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
          <div onClick={props.onReviewed} style={{
            cursor: props.onReviewed ? "pointer" : undefined,
            position: "relative",
            overflow: "hidden",
            borderRadius: 100,
            backgroundColor: "var(--surface-priority)",
            display: "flex",
            flexDirection: "row",
            padding: "10px 13px 10px 13px",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            paddingLeft: "calc(var(--space-action-horizontal) * 1px)",
            paddingTop: "calc(var(--space-control) * 1px)",
            paddingRight: "calc(var(--space-action-horizontal) * 1px)",
            paddingBottom: "calc(var(--space-control) * 1px)",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 600,
              fontSize: "calc(var(--size-label) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-on-dark)",
              flexShrink: 0,
            }}>{props.text3 ?? "Reviewed"}</span>
          </div>
          <div onClick={props.onOpen} style={{
            cursor: props.onOpen ? "pointer" : undefined,
            position: "relative",
            overflow: "hidden",
            borderRadius: 100,
            backgroundColor: "var(--surface-card)",
            display: "flex",
            flexDirection: "row",
            padding: "10px 13px 10px 13px",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            paddingLeft: "calc(var(--space-action-horizontal) * 1px)",
            paddingTop: "calc(var(--space-control) * 1px)",
            paddingRight: "calc(var(--space-action-horizontal) * 1px)",
            paddingBottom: "calc(var(--space-control) * 1px)",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 600,
              fontSize: "calc(var(--size-label) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>{props.text4 ?? "Open in Gmail"}</span>
          </div>
        </div>
        <div onClick={props.onMore} style={{
          cursor: props.onMore ? "pointer" : undefined,
          position: "relative",
          overflow: "hidden",
          borderRadius: 100,
          backgroundColor: "var(--surface-card)",
          display: "flex",
          flexDirection: "row",
          padding: "16px 16px 16px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--space-content) * 1px)",
          paddingTop: "calc(var(--space-content) * 1px)",
          paddingRight: "calc(var(--space-content) * 1px)",
          paddingBottom: "calc(var(--space-content) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <svg width={16.961} viewBox="0 0 16.961 4.063" fill="none" style={{
            position: "relative",
            width: 16.961,
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <path d={"M 2.031 4.063 C 1.659 4.063 1.319 3.972 1.011 3.79 C 0.703 3.605 0.457 3.359 0.272 3.051 C 0.091 2.744 0 2.404 0 2.031 C 0 1.656 0.091 1.316 0.272 1.011 C 0.457 0.703 0.703 0.459 1.011 0.277 C 1.319 0.092 1.659 0 2.031 0 C 2.407 0 2.747 0.092 3.051 0.277 C 3.359 0.459 3.604 0.703 3.786 1.011 C 3.97 1.316 4.063 1.656 4.063 2.031 C 4.063 2.404 3.97 2.744 3.786 3.051 C 3.604 3.359 3.359 3.605 3.051 3.79 C 2.747 3.972 2.407 4.063 2.031 4.063 Z"} fill="currentColor" fillRule="nonzero" />
            <path d={"M 8.48 4.063 C 8.108 4.063 7.768 3.972 7.46 3.79 C 7.152 3.605 6.906 3.359 6.722 3.051 C 6.54 2.744 6.449 2.404 6.449 2.031 C 6.449 1.656 6.54 1.316 6.722 1.011 C 6.906 0.703 7.152 0.459 7.46 0.277 C 7.768 0.092 8.108 0 8.48 0 C 8.856 0 9.196 0.092 9.501 0.277 C 9.808 0.459 10.053 0.703 10.235 1.011 C 10.419 1.316 10.512 1.656 10.512 2.031 C 10.512 2.404 10.419 2.744 10.235 3.051 C 10.053 3.359 9.808 3.605 9.501 3.79 C 9.196 3.972 8.856 4.063 8.48 4.063 Z"} fill="currentColor" fillRule="nonzero" />
            <path d={"M 14.93 4.063 C 14.557 4.063 14.217 3.972 13.909 3.79 C 13.602 3.605 13.355 3.359 13.171 3.051 C 12.989 2.744 12.898 2.404 12.898 2.031 C 12.898 1.656 12.989 1.316 13.171 1.011 C 13.355 0.703 13.602 0.459 13.909 0.277 C 14.217 0.092 14.557 0 14.93 0 C 15.305 0 15.645 0.092 15.95 0.277 C 16.258 0.459 16.502 0.703 16.684 1.011 C 16.869 1.316 16.961 1.656 16.961 2.031 C 16.961 2.404 16.869 2.744 16.684 3.051 C 16.502 3.359 16.258 3.605 15.95 3.79 C 15.645 3.972 15.305 4.063 14.93 4.063 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
    </div>
  );
}
export default PriorityCardDefault;
