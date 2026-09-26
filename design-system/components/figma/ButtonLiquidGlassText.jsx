import { LabelText } from './LabelText.jsx';
import { LiquidGlassRegularSmall } from './LiquidGlassRegularSmall.jsx';

// figma node: 24:94 Button - Liquid Glass - Text (24 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "size=" + __venc(p.size) + '|' + "style2=" + __venc(p.style2) + '|' + "destructive=" + __venc(p.destructive) + '|' + "isEnabled=" + __venc(p.isEnabled);

export function ButtonLiquidGlassText(_p = {}) {
  const props = { ..._p, size: _p.size ?? "sm", style2: _p.style2 ?? "glass prominent", destructive: _p.destructive ?? true, isEnabled: _p.isEnabled ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={false} type={"destructive"} />}</div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"destructive"} />}</div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={false}
        />
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"destructive"} />}</div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
        position: "relative",
        borderRadius: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 510,
          fontSize: 15,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "18px",
          color: "rgb(26,26,26)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>Label</span>
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
        position: "relative",
        borderRadius: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 510,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "18px",
          color: "rgb(26,26,26)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>Label</span>
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={false}
        />
      </div>
      <div style={{
        position: "relative",
        borderRadius: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 510,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "18px",
          color: "rgb(26,26,26)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>Label</span>
      </div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={false} type={"default"} />}</div>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"default"} />}</div>
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={false}
        />
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"default"} />}</div>
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={true} type={"default"} />}</div>
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"default"} />}</div>
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={false}
        />
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"default"} />}</div>
    </div>
  );
  const __body12 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={false} type={"preferred"} />}</div>
    </div>
  );
  const __body13 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"preferred"} />}</div>
    </div>
  );
  const __body14 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={false}
        />
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={false} type={"preferred"} />}</div>
    </div>
  );
  const __body15 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 60,
        height: 28,
      }}>
        <svg width={61} height={29} viewBox="0 0 61 29" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 61,
          height: 29,
          opacity: 0.94,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 14.5 C 0 6.492 6.492 0 14.5 0 L 46.5 0 C 54.508 0 61 6.492 61 14.5 L 61 14.5 C 61 22.508 54.508 29 46.5 29 L 14.5 29 C 6.492 29 0 22.508 0 14.5 L 0 14.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={61} height={29} viewBox="0 0 61 29" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 61,
          height: 29,
          overflow: "hidden",
          borderRadius: 1000,
          color: "var(--accents-red)",
        }}>
          <path d={"M 0 14.5 C 0 6.492 6.492 0 14.5 0 L 46.5 0 C 54.508 0 61 6.492 61 14.5 L 61 14.5 C 61 22.508 54.508 29 46.5 29 L 14.5 29 C 6.492 29 0 22.508 0 14.5 L 0 14.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __body16 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 69,
        height: 34,
      }}>
        <svg width={70} height={35} viewBox="0 0 70 35" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 70,
          height: 35,
          opacity: 0.94,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 17.5 C 0 7.835 7.835 0 17.5 0 L 52.5 0 C 62.165 0 70 7.835 70 17.5 L 70 17.5 C 70 27.165 62.165 35 52.5 35 L 17.5 35 C 7.835 35 0 27.165 0 17.5 L 0 17.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={70} height={35} viewBox="0 0 70 35" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 70,
          height: 35,
          overflow: "hidden",
          borderRadius: 1000,
          color: "var(--accents-red)",
        }}>
          <path d={"M 0 17.5 C 0 7.835 7.835 0 17.5 0 L 52.5 0 C 62.165 0 70 7.835 70 17.5 L 70 17.5 C 70 27.165 62.165 35 52.5 35 L 17.5 35 C 7.835 35 0 27.165 0 17.5 L 0 17.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __body17 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 85,
        height: 50,
      }}>
        <svg width={86} height={51} viewBox="0 0 86 51" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 86,
          height: 51,
          opacity: 0.94,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 25.5 C 0 11.417 11.417 0 25.5 0 L 60.5 0 C 74.583 0 86 11.417 86 25.5 L 86 25.5 C 86 39.583 74.583 51 60.5 51 L 25.5 51 C 11.417 51 0 39.583 0 25.5 L 0 25.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={86} height={51} viewBox="0 0 86 51" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 86,
          height: 51,
          overflow: "hidden",
          borderRadius: 1000,
          color: "var(--accents-red)",
        }}>
          <path d={"M 0 25.5 C 0 11.417 11.417 0 25.5 0 L 60.5 0 C 74.583 0 86 11.417 86 25.5 L 86 25.5 C 86 39.583 74.583 51 60.5 51 L 25.5 51 C 11.417 51 0 39.583 0 25.5 L 0 25.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __body18 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "5px 10px 5px 10px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 60,
          height: 28,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={true} style={{ transform: "scale(1.250, 0.583)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"sm"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __body19 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "8px 12px 8px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 69,
          height: 34,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={true} style={{ transform: "scale(1.438, 0.708)", transformOrigin: "0 0" }} />}</div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __body20 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      padding: "16px 20px 16px 20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 85,
          height: 50,
        }}>
        <LiquidGlassRegularSmall
          style={{ transform: "scale(1.771, 1.042)", transformOrigin: "0 0" }}
          mode={"light"}
          active={true}
          prominent={true}
        />
      </div>
      <div style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <LabelText mode={"light"} size={"lg"} isEnabled={true} type={"preferred"} />}</div>
    </div>
  );
  const __impls = {
    // figma: Size=Small, Style=Glass, Is Enabled=False, Destructive=True
    "size=sm|style2=glass|destructive=true|isEnabled=false": __body0,
    // figma: Size=Medium, Style=Glass, Is Enabled=False, Destructive=True
    "size=md|style2=glass|destructive=true|isEnabled=false": __body1,
    // figma: Size=Large, Style=Glass, Is Enabled=False, Destructive=True
    "size=lg|style2=glass|destructive=true|isEnabled=false": __body2,
    // figma: Size=Small, Style=Glass, Is Enabled=True, Destructive=True
    "size=sm|style2=glass|destructive=true|isEnabled=true": __body3,
    // figma: Size=Medium, Style=Glass, Is Enabled=True, Destructive=True
    "size=md|style2=glass|destructive=true|isEnabled=true": __body4,
    // figma: Size=Large, Style=Glass, Is Enabled=True, Destructive=True
    "size=lg|style2=glass|destructive=true|isEnabled=true": __body5,
    // figma: Size=Small, Style=Glass, Is Enabled=False, Destructive=False
    "size=sm|style2=glass|destructive=false|isEnabled=false": __body6,
    // figma: Size=Medium, Style=Glass, Is Enabled=False, Destructive=False
    "size=md|style2=glass|destructive=false|isEnabled=false": __body7,
    // figma: Size=Large, Style=Glass, Is Enabled=False, Destructive=False
    "size=lg|style2=glass|destructive=false|isEnabled=false": __body8,
    // figma: Size=Small, Style=Glass, Is Enabled=True, Destructive=False
    "size=sm|style2=glass|destructive=false|isEnabled=true": __body9,
    // figma: Size=Medium, Style=Glass, Is Enabled=True, Destructive=False
    "size=md|style2=glass|destructive=false|isEnabled=true": __body10,
    // figma: Size=Large, Style=Glass, Is Enabled=True, Destructive=False
    "size=lg|style2=glass|destructive=false|isEnabled=true": __body11,
    // figma: Size=Small, Style=Glass Prominent, Is Enabled=False, Destructive=True
    "size=sm|style2=glass prominent|destructive=true|isEnabled=false": __body12,
    // figma: Size=Medium, Style=Glass Prominent, Is Enabled=False, Destructive=True
    "size=md|style2=glass prominent|destructive=true|isEnabled=false": __body13,
    // figma: Size=Large, Style=Glass Prominent, Is Enabled=False, Destructive=True
    "size=lg|style2=glass prominent|destructive=true|isEnabled=false": __body14,
    // figma: Size=Small, Style=Glass Prominent, Is Enabled=True, Destructive=True
    "size=sm|style2=glass prominent|destructive=true|isEnabled=true": __body15,
    // figma: Size=Medium, Style=Glass Prominent, Is Enabled=True, Destructive=True
    "size=md|style2=glass prominent|destructive=true|isEnabled=true": __body16,
    // figma: Size=Large, Style=Glass Prominent, Is Enabled=True, Destructive=True
    "size=lg|style2=glass prominent|destructive=true|isEnabled=true": __body17,
    // figma: Size=Small, Style=Glass Prominent, Is Enabled=False, Destructive=False
    "size=sm|style2=glass prominent|destructive=false|isEnabled=false": __body12,
    // figma: Size=Medium, Style=Glass Prominent, Is Enabled=False, Destructive=False
    "size=md|style2=glass prominent|destructive=false|isEnabled=false": __body13,
    // figma: Size=Large, Style=Glass Prominent, Is Enabled=False, Destructive=False
    "size=lg|style2=glass prominent|destructive=false|isEnabled=false": __body14,
    // figma: Size=Small, Style=Glass Prominent, Is Enabled=True, Destructive=False
    "size=sm|style2=glass prominent|destructive=false|isEnabled=true": __body18,
    // figma: Size=Medium, Style=Glass Prominent, Is Enabled=True, Destructive=False
    "size=md|style2=glass prominent|destructive=false|isEnabled=true": __body19,
    // figma: Size=Large, Style=Glass Prominent, Is Enabled=True, Destructive=False
    "size=lg|style2=glass prominent|destructive=false|isEnabled=true": __body20,
  };
  return (__impls[__vkey(props)] ?? __body15)();
}
export default ButtonLiquidGlassText;
