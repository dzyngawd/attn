import { AngleLeft } from './AngleLeft.jsx';

// figma node: 148:9535 Header (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "level=" + __venc(p.level) + '|' + "state=" + __venc(p.state);

export function Header(_p = {}) {
  const props = { ..._p, headerText: _p.headerText ?? "", level: _p.level ?? "l1", state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 402,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: "calc(var(--space-compact) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "24px 20px 24px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--space-content) * 1px)",
        paddingLeft: "calc(var(--space-panel) * 1px)",
        paddingTop: "calc(var(--space-section) * 1px)",
        paddingRight: "calc(var(--space-panel) * 1px)",
        paddingBottom: "calc(var(--space-section) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          padding: "16px 0px 16px 0px",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          gap: "calc(var(--space-control) * 1px)",
          paddingTop: "calc(var(--space-content) * 1px)",
          paddingBottom: "calc(var(--space-content) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 50,
              height: 50,
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 50,
                height: 50,
                borderRadius: 1000,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 50,
                  height: 50,
                }}>
                  <svg width={50} height={50} viewBox="0 0 50 50" fill="none" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 50,
                    height: 50,
                    overflow: "hidden",
                    borderRadius: 1000,
                    filter: "drop-shadow(0px 0px 0.500px rgb(232,232,232)) drop-shadow(0px 8px 15px rgba(0,0,0,0.02))",
                  }}>
                    <path d={"M 0 25 C 0 11.193 11.193 0 25 0 L 25 0 C 38.807 0 50 11.193 50 25 L 50 25 C 50 38.807 38.807 50 25 50 L 25 50 C 11.193 50 0 38.807 0 25 L 0 25 Z"} fill="currentColor" fillRule="nonzero" />
                  </svg>
                </div>
                <div style={{
                  position: "relative",
                  width: 28,
                  height: 36,
                  borderRadius: 100,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }} />
              </div>
              <div style={{
                  position: "absolute",
                  left: 13,
                  top: 13,
                  width: 24,
                  height: 24,
                }}>{props.icon2 ?? <AngleLeft />}</div>
            </div>
          </div>
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
              fontWeight: 700,
              fontSize: "calc(var(--size-title-small) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>{props.text1 ?? "Needs attn."}</span>
          </div>
          <div style={{
            position: "relative",
            width: 50,
            height: 50,
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
          }} />
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 402,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: "calc(var(--space-compact) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "16px 20px 16px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--space-content) * 1px)",
        paddingLeft: "calc(var(--space-panel) * 1px)",
        paddingTop: "calc(var(--space-content) * 1px)",
        paddingRight: "calc(var(--space-panel) * 1px)",
        paddingBottom: "calc(var(--space-content) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--space-section) * 1px)",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 50,
              height: 50,
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 50,
                height: 50,
                borderRadius: 1000,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 50,
                  height: 50,
                }}>
                  <svg width={50} height={50} viewBox="0 0 50 50" fill="none" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 50,
                    height: 50,
                    overflow: "hidden",
                    borderRadius: 1000,
                    filter: "drop-shadow(0px 0px 0.500px rgb(232,232,232)) drop-shadow(0px 8px 15px rgba(0,0,0,0.02))",
                  }}>
                    <path d={"M 0 25 C 0 11.193 11.193 0 25 0 L 25 0 C 38.807 0 50 11.193 50 25 L 50 25 C 50 38.807 38.807 50 25 50 L 25 50 C 11.193 50 0 38.807 0 25 L 0 25 Z"} fill="currentColor" fillRule="nonzero" />
                  </svg>
                </div>
                <div style={{
                  position: "relative",
                  width: 28,
                  height: 36,
                  borderRadius: 100,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }} />
              </div>
              <div style={{
                  position: "absolute",
                  left: 13,
                  top: 13,
                  width: 24,
                  height: 24,
                }}>{props.icon2 ?? <AngleLeft />}</div>
            </div>
          </div>
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
              fontWeight: 700,
              fontSize: "calc(var(--size-title-medium) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>{props.text1 ?? "Needs attn."}</span>
          </div>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 402,
      borderTop: "1px solid rgb(251,251,251)",
      borderRight: "1px solid rgb(251,251,251)",
      borderBottom: "1px solid rgb(251,251,251)",
      borderLeft: "1px solid rgb(251,251,251)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: "calc(var(--space-compact) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "16px 20px 16px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--space-content) * 1px)",
        paddingLeft: "calc(var(--space-panel) * 1px)",
        paddingTop: "calc(var(--space-content) * 1px)",
        paddingRight: "calc(var(--space-panel) * 1px)",
        paddingBottom: "calc(var(--space-content) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "calc(var(--space-section) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              width: 50,
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 50,
                height: 50,
                borderRadius: 1000,
                display: "flex",
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 50,
                  height: 50,
                }}>
                  <svg width={50} height={50} viewBox="0 0 50 50" fill="none" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 50,
                    height: 50,
                    overflow: "hidden",
                    borderRadius: 1000,
                    filter: "drop-shadow(0px 0px 0.500px rgb(232,232,232)) drop-shadow(0px 8px 15px rgba(0,0,0,0.02))",
                  }}>
                    <path d={"M 0 25 C 0 11.193 11.193 0 25 0 L 25 0 C 38.807 0 50 11.193 50 25 L 50 25 C 50 38.807 38.807 50 25 50 L 25 50 C 11.193 50 0 38.807 0 25 L 0 25 Z"} fill="currentColor" fillRule="nonzero" />
                  </svg>
                </div>
                <div style={{
                  position: "relative",
                  width: 28,
                  height: 36,
                  borderRadius: 100,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }} />
              </div>
              <div style={{
                  position: "absolute",
                  left: 13,
                  top: 13,
                  width: 24,
                  height: 24,
                }}>{props.icon2 ?? <AngleLeft />}</div>
            </div>
          </div>
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
              fontWeight: 700,
              fontSize: "calc(var(--size-title-small) * 1px)",
              whiteSpace: "nowrap",
              lineHeight: "100%",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>{props.text1 ?? "Needs attn."}</span>
          </div>
          <div style={{
            position: "relative",
            width: 50,
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--space-control) * 1px)",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch",
          }} />
        </div>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 402,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--space-compact) * 1px)",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      color: "rgb(17,17,20)",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "16px 20px 16px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--space-content) * 1px)",
        paddingLeft: "calc(var(--space-panel) * 1px)",
        paddingTop: "calc(var(--space-content) * 1px)",
        paddingRight: "calc(var(--space-panel) * 1px)",
        paddingBottom: "calc(var(--space-screen) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
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
          <span style={{
            position: "relative",
            fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 700,
            fontSize: "calc(var(--size-title-large) * 1px)",
            whiteSpace: "nowrap",
            lineHeight: "100%",
            color: "var(--text-primary)",
            flexShrink: 0,
          }}>{props.text1 ?? "Needs attn."}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Inter Tight\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 500,
            fontSize: "calc(var(--size-body-2) * 1px)",
            whiteSpace: "nowrap",
            lineHeight: "14px",
            color: "var(--text-on-dark-secondary)",
            flexShrink: 0,
          }}>{props.text2 ?? "Monday, July 20"}</span>
        </div>
        <div style={{
          position: "relative",
          width: 50,
          height: 50,
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 50,
            height: 50,
            borderRadius: 1000,
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
          }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 50,
              height: 50,
            }}>
              <svg width={50} height={50} viewBox="0 0 50 50" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 50,
                height: 50,
                overflow: "hidden",
                borderRadius: 1000,
                filter: "drop-shadow(0px 0px 0.500px rgb(232,232,232)) drop-shadow(0px 8px 15px rgba(0,0,0,0.02))",
              }}>
                <path d={"M 0 25 C 0 11.193 11.193 0 25 0 L 25 0 C 38.807 0 50 11.193 50 25 L 50 25 C 50 38.807 38.807 50 25 50 L 25 50 C 11.193 50 0 38.807 0 25 L 0 25 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <div style={{
              position: "relative",
              width: 28,
              height: 36,
              borderRadius: 100,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0,
            }} />
          </div>
          <div style={{
            position: "absolute",
            left: 15.5,
            top: 15.5,
            width: 19,
            height: 19,
            overflow: "hidden",
          }}>
            <svg width={14.250} height={15.833} viewBox="0 0 14.250 15.833" fill="none" style={{
              position: "absolute",
              left: 2.375,
              top: 1.583,
              width: 14.25,
              height: 15.833,
            }}>
              <path d={"M 7.125 7.917 C 8.175 7.917 9.182 7.5 9.924 6.757 C 10.666 6.015 11.083 5.008 11.083 3.958 C 11.083 2.909 10.666 1.902 9.924 1.159 C 9.182 0.417 8.175 0 7.125 0 C 6.075 0 5.068 0.417 4.326 1.159 C 3.584 1.902 3.167 2.909 3.167 3.958 C 3.167 5.008 3.584 6.015 4.326 6.757 C 5.068 7.5 6.075 7.917 7.125 7.917 Z M 7.125 9.5 C 2.929 9.5 0 11.638 0 14.646 C 0 15.279 0.554 15.833 1.188 15.833 L 13.063 15.833 C 13.696 15.833 14.25 15.279 14.25 14.646 C 14.25 11.638 11.321 9.5 7.125 9.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Level=L2, State=Default
    "level=l2|state=default": __body0,
    // figma: Level=L3, State=Default
    "level=l3|state=default": __body1,
    // figma: Level=L3, State=On-Scroll
    "level=l3|state=on-scroll": __body2,
    // figma: Level=L1, State=Default
    "level=l1|state=default": __body3,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default Header;
