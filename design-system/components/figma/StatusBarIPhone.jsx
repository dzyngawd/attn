// figma node: 69:357 Status Bar - iPhone (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "background=" + __venc(p.background);

export function StatusBarIPhone(_p = {}) {
  const props = { ..._p, background: _p.background ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 402,
      height: 50,
      display: "flex",
      flexDirection: "column",
      padding: "21px 0px 21px 0px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      color: "var(--labels-primary-2)",
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
          gap: 10,
          padding: "0px 6px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 590,
            fontSize: 17,
            textAlign: "center",
            whiteSpace: "nowrap",
            lineHeight: "22px",
            color: "var(--labels-primary-2)",
            flexShrink: 0,
          }}>{props.text1 ?? "9:41"}</span>
        </div>
        <div style={{
          position: "relative",
          width: 124,
          height: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }} />
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 7,
          padding: "0px 16px 0px 6px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <svg width={19.200} height={12.226} viewBox="0 0 19.200 12.226" fill="none" style={{
            position: "relative",
            width: 19.2,
            height: 12.226,
            flexShrink: 0,
          }}>
            <path d={"M 19.2 1.146 C 19.2 0.513 18.722 0 18.133 0 L 17.067 0 C 16.478 0 16 0.513 16 1.146 L 16 11.08 C 16 11.713 16.478 12.226 17.067 12.226 L 18.133 12.226 C 18.722 12.226 19.2 11.713 19.2 11.08 L 19.2 1.146 Z M 11.766 2.445 L 12.833 2.445 C 13.422 2.445 13.899 2.971 13.899 3.619 L 13.899 11.053 C 13.899 11.701 13.422 12.226 12.833 12.226 L 11.766 12.226 C 11.177 12.226 10.699 11.701 10.699 11.053 L 10.699 3.619 C 10.699 2.971 11.177 2.445 11.766 2.445 Z M 7.434 5.094 L 6.367 5.094 C 5.778 5.094 5.301 5.627 5.301 6.283 L 5.301 11.038 C 5.301 11.694 5.778 12.226 6.367 12.226 L 7.434 12.226 C 8.023 12.226 8.501 11.694 8.501 11.038 L 8.501 6.283 C 8.501 5.627 8.023 5.094 7.434 5.094 Z M 2.133 7.54 L 1.067 7.54 C 0.478 7.54 0 8.064 0 8.711 L 0 11.055 C 0 11.702 0.478 12.226 1.067 12.226 L 2.133 12.226 C 2.722 12.226 3.2 11.702 3.2 11.055 L 3.2 8.711 C 3.2 8.064 2.722 7.54 2.133 7.54 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
          <svg width={17.142} height={12.328} viewBox="0 0 17.142 12.328" fill="none" style={{
            position: "relative",
            width: 17.142,
            height: 12.328,
            flexShrink: 0,
          }}>
            <path d={"M 8.571 2.466 C 11.058 2.466 13.45 3.388 15.253 5.042 C 15.389 5.17 15.606 5.168 15.739 5.038 L 17.037 3.775 C 17.104 3.709 17.142 3.62 17.142 3.527 C 17.141 3.435 17.102 3.346 17.034 3.281 C 12.303 -1.094 4.839 -1.094 0.108 3.281 C 0.04 3.346 0.001 3.435 0 3.527 C -0.001 3.62 0.037 3.709 0.105 3.775 L 1.403 5.038 C 1.536 5.168 1.753 5.17 1.889 5.042 C 3.692 3.388 6.084 2.466 8.571 2.466 Z M 8.568 6.687 C 9.925 6.686 11.234 7.198 12.24 8.122 C 12.376 8.253 12.591 8.251 12.723 8.116 L 14.011 6.797 C 14.078 6.727 14.116 6.634 14.115 6.536 C 14.114 6.438 14.075 6.345 14.005 6.278 C 10.942 3.387 6.197 3.387 3.133 6.278 C 3.064 6.345 3.024 6.438 3.023 6.536 C 3.023 6.634 3.06 6.728 3.128 6.797 L 4.415 8.116 C 4.548 8.251 4.762 8.253 4.898 8.122 C 5.904 7.199 7.212 6.687 8.568 6.687 Z M 11.092 9.48 C 11.094 9.585 11.057 9.687 10.99 9.761 L 8.813 12.216 C 8.749 12.288 8.662 12.328 8.572 12.328 C 8.481 12.328 8.394 12.288 8.33 12.216 L 6.153 9.761 C 6.086 9.687 6.049 9.585 6.051 9.48 C 6.053 9.375 6.094 9.275 6.164 9.204 C 7.554 7.89 9.59 7.89 10.98 9.204 C 11.05 9.275 11.09 9.375 11.092 9.48 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
          <div style={{
            position: "relative",
            width: 27.328,
            height: 13,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 25,
              height: 13,
              opacity: 0.35,
              borderRadius: 4.300000190734863,
              boxShadow: "inset 0 0 0 1px var(--labels-primary-2)",
            }} />
            <svg width={1.328} height={4.075} viewBox="0 0 1.328 4.075" fill="none" style={{
              position: "absolute",
              left: 26,
              top: 4.781,
              width: 1.328,
              height: 4.075,
              opacity: 0.4,
            }}>
              <path d={"M 0 0 L 0 4.075 C 0.805 3.73 1.328 2.927 1.328 2.038 C 1.328 1.148 0.805 0.345 0 0 Z"} fill="currentColor" fillRule="evenodd" />
            </svg>
            <div style={{
              position: "absolute",
              left: 2,
              top: 2,
              width: 21,
              height: 9,
              borderRadius: 2.5,
              backgroundColor: "var(--labels-primary-2)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 402,
      height: 50,
      backgroundColor: "var(--backgrounds-primary)",
      display: "flex",
      flexDirection: "column",
      padding: "21px 0px 21px 0px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      color: "var(--labels-primary-2)",
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
          gap: 10,
          padding: "0px 6px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 590,
            fontSize: 17,
            textAlign: "center",
            whiteSpace: "nowrap",
            lineHeight: "22px",
            color: "var(--labels-primary-2)",
            flexShrink: 0,
          }}>{props.text1 ?? "9:41"}</span>
        </div>
        <div style={{
          position: "relative",
          width: 124,
          height: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
        }} />
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 7,
          padding: "0px 16px 0px 6px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <svg width={19.200} height={12.226} viewBox="0 0 19.200 12.226" fill="none" style={{
            position: "relative",
            width: 19.2,
            height: 12.226,
            flexShrink: 0,
          }}>
            <path d={"M 19.2 1.146 C 19.2 0.513 18.722 0 18.133 0 L 17.067 0 C 16.478 0 16 0.513 16 1.146 L 16 11.08 C 16 11.713 16.478 12.226 17.067 12.226 L 18.133 12.226 C 18.722 12.226 19.2 11.713 19.2 11.08 L 19.2 1.146 Z M 11.766 2.445 L 12.833 2.445 C 13.422 2.445 13.899 2.971 13.899 3.619 L 13.899 11.053 C 13.899 11.701 13.422 12.226 12.833 12.226 L 11.766 12.226 C 11.177 12.226 10.699 11.701 10.699 11.053 L 10.699 3.619 C 10.699 2.971 11.177 2.445 11.766 2.445 Z M 7.434 5.094 L 6.367 5.094 C 5.778 5.094 5.301 5.627 5.301 6.283 L 5.301 11.038 C 5.301 11.694 5.778 12.226 6.367 12.226 L 7.434 12.226 C 8.023 12.226 8.501 11.694 8.501 11.038 L 8.501 6.283 C 8.501 5.627 8.023 5.094 7.434 5.094 Z M 2.133 7.54 L 1.067 7.54 C 0.478 7.54 0 8.064 0 8.711 L 0 11.055 C 0 11.702 0.478 12.226 1.067 12.226 L 2.133 12.226 C 2.722 12.226 3.2 11.702 3.2 11.055 L 3.2 8.711 C 3.2 8.064 2.722 7.54 2.133 7.54 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
          <svg width={17.142} height={12.328} viewBox="0 0 17.142 12.328" fill="none" style={{
            position: "relative",
            width: 17.142,
            height: 12.328,
            flexShrink: 0,
          }}>
            <path d={"M 8.571 2.466 C 11.058 2.466 13.45 3.388 15.253 5.042 C 15.389 5.17 15.606 5.168 15.739 5.038 L 17.037 3.775 C 17.104 3.709 17.142 3.62 17.142 3.527 C 17.141 3.435 17.102 3.346 17.034 3.281 C 12.303 -1.094 4.839 -1.094 0.108 3.281 C 0.04 3.346 0.001 3.435 0 3.527 C -0.001 3.62 0.037 3.709 0.105 3.775 L 1.403 5.038 C 1.536 5.168 1.753 5.17 1.889 5.042 C 3.692 3.388 6.084 2.466 8.571 2.466 Z M 8.568 6.687 C 9.925 6.686 11.234 7.198 12.24 8.122 C 12.376 8.253 12.591 8.251 12.723 8.116 L 14.011 6.797 C 14.078 6.727 14.116 6.634 14.115 6.536 C 14.114 6.438 14.075 6.345 14.005 6.278 C 10.942 3.387 6.197 3.387 3.133 6.278 C 3.064 6.345 3.024 6.438 3.023 6.536 C 3.023 6.634 3.06 6.728 3.128 6.797 L 4.415 8.116 C 4.548 8.251 4.762 8.253 4.898 8.122 C 5.904 7.199 7.212 6.687 8.568 6.687 Z M 11.092 9.48 C 11.094 9.585 11.057 9.687 10.99 9.761 L 8.813 12.216 C 8.749 12.288 8.662 12.328 8.572 12.328 C 8.481 12.328 8.394 12.288 8.33 12.216 L 6.153 9.761 C 6.086 9.687 6.049 9.585 6.051 9.48 C 6.053 9.375 6.094 9.275 6.164 9.204 C 7.554 7.89 9.59 7.89 10.98 9.204 C 11.05 9.275 11.09 9.375 11.092 9.48 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
          <div style={{
            position: "relative",
            width: 27.328,
            height: 13,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 25,
              height: 13,
              opacity: 0.35,
              borderRadius: 4.300000190734863,
              boxShadow: "inset 0 0 0 1px var(--labels-primary-2)",
            }} />
            <svg width={1.328} height={4.075} viewBox="0 0 1.328 4.075" fill="none" style={{
              position: "absolute",
              left: 26,
              top: 4.781,
              width: 1.328,
              height: 4.075,
              opacity: 0.4,
            }}>
              <path d={"M 0 0 L 0 4.075 C 0.805 3.73 1.328 2.927 1.328 2.038 C 1.328 1.148 0.805 0.345 0 0 Z"} fill="currentColor" fillRule="evenodd" />
            </svg>
            <div style={{
              position: "absolute",
              left: 2,
              top: 2,
              width: 21,
              height: 9,
              borderRadius: 2.5,
              backgroundColor: "var(--labels-primary-2)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Background=False
    "background=false": __body0,
    // figma: Background=True
    "background=true": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default StatusBarIPhone;
