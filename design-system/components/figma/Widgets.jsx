import { WidgetItems } from './WidgetItems.jsx';

// figma node: 113:5673 Widgets (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type);

export function Widgets(_p = {}) {
  const props = { ..._p, type: _p.type ?? "iPad" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 628,
      overflow: "hidden",
      borderRadius: 34,
      background: "linear-gradient(180deg, rgb(0,159,254) 0.00%, rgb(249,251,227) 100.00%)",
      boxShadow: "inset 0px 20px 10px -20px rgb(34,34,34), inset 0px -20px 10px -20px rgb(34,34,34), inset 0px 1px 0px 0px rgb(26,26,26), inset 0px -1px 0px 0px rgb(26,26,26), inset 0px 4px 0.500px -4px rgb(102,102,102), inset 0px -4px 0.500px -4px rgb(102,102,102)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-control) * 1px)",
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
        display: "flex",
        flexDirection: "row",
        gap: 15,
        alignItems: "flex-start",
        flexWrap: "wrap",
        alignContent: "space-between",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <WidgetItems
          style={{ position: "relative", width: 290.5, flexShrink: 0 }}
          property1={"extra large"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
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
              backgroundColor: "rgb(255,226,193)",
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
              }}>$</span>
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
                }}>Credit card payment</span>
                <div style={{
                  position: "relative",
                  width: 108,
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
                    color: "var(--status-action-needed)",
                    flexShrink: 0,
                  }}>Due Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
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
              backgroundColor: "rgb(201,247,255)",
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
              }}>$</span>
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
                }}>Credit card payment</span>
                <div style={{
                  position: "relative",
                  width: 95,
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
                    color: "var(--status-action-needed)",
                    flexShrink: 0,
                  }}>Due Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
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
              backgroundColor: "rgb(189,255,220)",
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
              }}>$</span>
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
                }}>Credit card payment</span>
                <div style={{
                  position: "relative",
                  width: 70,
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
                    fontSize: "calc(var(--size-body-2) * 1px)",
                    whiteSpace: "nowrap",
                    lineHeight: "100%",
                    color: "var(--text-subtle)",
                    flexShrink: 0,
                  }}>Closes in 5 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
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
              backgroundColor: "rgb(189,255,220)",
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
              }}>$</span>
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
                }}>Credit card payment</span>
                <div style={{
                  position: "relative",
                  width: 68,
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
                    fontSize: "calc(var(--size-body-2) * 1px)",
                    whiteSpace: "nowrap",
                    lineHeight: "100%",
                    color: "var(--text-subtle)",
                    flexShrink: 0,
                  }}>Closes in 5 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
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
              backgroundColor: "rgb(189,255,220)",
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
              }}>$</span>
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
                }}>Credit card payment</span>
                <div style={{
                  position: "relative",
                  width: 80,
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
                    fontSize: "calc(var(--size-body-2) * 1px)",
                    whiteSpace: "nowrap",
                    lineHeight: "100%",
                    color: "var(--text-subtle)",
                    flexShrink: 0,
                  }}>Closes in 5 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "matrix(-1,0,0,1,628,0)",
        transformOrigin: "0 0",
        width: 628,
        height: 302,
        borderRadius: 34,
        boxShadow: "inset 0 0 0 5.506px var(--line-inverse)",
      }} />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 350,
      height: 164,
      borderRadius: 28,
      background: "linear-gradient(180deg, rgb(0,159,254) 0.00%, rgb(249,251,227) 100.00%)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--space-control) * 1px)",
      padding: "16px 16px 16px 16px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--space-content) * 1px)",
      paddingTop: "calc(var(--space-content) * 1px)",
      paddingRight: "calc(var(--space-content) * 1px)",
      paddingBottom: "calc(var(--space-content) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 163,
        top: 169.333,
        fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 510,
        fontSize: "calc(var(--size-caption) * 1px)",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "var(--text-on-dark)",
        filter: "drop-shadow(0px 2px 25px rgb(0,0,0))",
      }}>{props.text1 ?? "attn"}</span>
      <div style={{
        position: "relative",
        borderRadius: 11,
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--space-compact) * 1px)",
        alignItems: "flex-start",
        flexWrap: "wrap",
        alignContent: "space-between",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <WidgetItems
          style={{ position: "relative", width: 155, flexShrink: 0 }}
          property1={"large"}
        />
        <div style={{
          position: "relative",
          width: 155,
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
          flexShrink: 0,
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
              }}>Credit card payment</span>
              <div style={{
                position: "relative",
                width: 93,
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
                  fontSize: "calc(var(--size-caption) * 1px)",
                  whiteSpace: "nowrap",
                  lineHeight: "100%",
                  color: "var(--status-action-needed)",
                  flexShrink: 0,
                }}>Due Today</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 155,
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
          flexShrink: 0,
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
              }}>Credit card payment</span>
              <div style={{
                position: "relative",
                width: 82,
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
                  fontSize: "calc(var(--size-caption) * 1px)",
                  whiteSpace: "nowrap",
                  lineHeight: "100%",
                  color: "var(--status-action-needed)",
                  flexShrink: 0,
                }}>Due Today</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 155,
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
          flexShrink: 0,
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
              }}>Credit card payment</span>
              <div style={{
                position: "relative",
                width: 60,
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
                  color: "var(--text-subtle)",
                  flexShrink: 0,
                }}>Closes in 5 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "matrix(-1,0,0,1,349.670,0)",
        transformOrigin: "0 0",
        width: 349.67,
        height: 164,
        borderRadius: 28,
        boxShadow: "inset 0 0 0 5.506px var(--line-inverse)",
      }} />
    </div>
  );
  const __impls = {
    // figma: Type=iPad
    "type=iPad": __body0,
    // figma: Type=iPhone
    "type=iPhone": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Widgets;
