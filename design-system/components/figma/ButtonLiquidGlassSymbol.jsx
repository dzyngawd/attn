import { LabelSymbolDefault } from './LabelSymbolDefault.jsx';
import { LabelSymbolPreferred } from './LabelSymbolPreferred.jsx';
import { LiquidGlassRegularSmall } from './LiquidGlassRegularSmall.jsx';

// figma node: 24:194 Button - Liquid Glass - Symbol (8 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "style2=" + __venc(p.style2) + '|' + "isEnabled=" + __venc(p.isEnabled) + '|' + "destructive=" + __venc(p.destructive);

export function ButtonLiquidGlassSymbol(_p = {}) {
  const props = { ..._p, style2: _p.style2 ?? "glass prominent", isEnabled: _p.isEnabled ?? true, destructive: _p.destructive ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 50,
      height: 50,
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 50,
          height: 50,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.042, 1.042)", transformOrigin: "0 0" }} />}</div>
      <div style={{
        position: "relative",
        height: 36,
        borderRadius: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 590,
          fontSize: 19,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          color: "rgb(26,26,26)",
          flexShrink: 0,
        }}>􀆅</span>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 50,
      height: 50,
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 50,
          height: 50,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.042, 1.042)", transformOrigin: "0 0" }} />}</div>
      <div style={{
        position: "relative",
        height: 36,
        borderRadius: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 590,
          fontSize: 19,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          color: "var(--accents-red)",
          flexShrink: 0,
        }}>􀆅</span>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 50,
      height: 50,
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 50,
        height: 50,
      }}>
        <svg width={51} height={51} viewBox="0 0 51 51" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 51,
          height: 51,
          opacity: 0.94,
          overflow: "hidden",
          borderRadius: 1000,
          color: "rgb(255,255,255)",
        }}>
          <path d={"M 0 25.5 C 0 11.417 11.417 0 25.5 0 L 25.5 0 C 39.583 0 51 11.417 51 25.5 L 51 25.5 C 51 39.583 39.583 51 25.5 51 L 25.5 51 C 11.417 51 0 39.583 0 25.5 L 0 25.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <svg width={51} height={51} viewBox="0 0 51 51" fill="none" style={{
          position: "absolute",
          left: -0.5,
          top: -0.5,
          width: 51,
          height: 51,
          overflow: "hidden",
          borderRadius: 1000,
          color: "var(--accents-red)",
        }}>
          <path d={"M 0 25.5 C 0 11.417 11.417 0 25.5 0 L 25.5 0 C 39.583 0 51 11.417 51 25.5 L 51 25.5 C 51 39.583 39.583 51 25.5 51 L 25.5 51 C 11.417 51 0 39.583 0 25.5 L 0 25.5 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
      </div>
      <div style={{ position: "relative", height: 36, flexShrink: 0 }}>{props.icon2 ?? <LabelSymbolPreferred mode={"light"} isEnabled={true} />}</div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 50,
      height: 50,
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 50,
          height: 50,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={true} style={{ transform: "scale(1.042, 1.042)", transformOrigin: "0 0" }} />}</div>
      <div style={{ position: "relative", height: 36, flexShrink: 0 }}>{props.icon2 ?? <LabelSymbolPreferred mode={"light"} isEnabled={true} />}</div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 50,
      height: 50,
      borderRadius: 1000,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 50,
          height: 50,
        }}>{props.icon1 ?? <LiquidGlassRegularSmall mode={"light"} active={true} prominent={false} style={{ transform: "scale(1.042, 1.042)", transformOrigin: "0 0" }} />}</div>
      <div style={{ position: "relative", height: 36, flexShrink: 0 }}>{props.icon2 ?? <LabelSymbolDefault mode={"light"} isEnabled={true} />}</div>
    </div>
  );
  const __impls = {
    // figma: Style=Glass, Is Enabled=False, Destructive=True
    "style2=glass|isEnabled=false|destructive=true": __body0,
    // figma: Style=Glass, Is Enabled=True, Destructive=True
    "style2=glass|isEnabled=true|destructive=true": __body1,
    // figma: Style=Glass Prominent, Is Enabled=False, Destructive=True
    "style2=glass prominent|isEnabled=false|destructive=true": __body0,
    // figma: Style=Glass Prominent, Is Enabled=True, Destructive=True
    "style2=glass prominent|isEnabled=true|destructive=true": __body2,
    // figma: Style=Glass Prominent, Is Enabled=False, Destructive=False
    "style2=glass prominent|isEnabled=false|destructive=false": __body0,
    // figma: Style=Glass Prominent, Is Enabled=True, Destructive=False
    "style2=glass prominent|isEnabled=true|destructive=false": __body3,
    // figma: Style=Glass, Is Enabled=False, Destructive=False
    "style2=glass|isEnabled=false|destructive=false": __body0,
    // figma: Style=Glass, Is Enabled=True, Destructive=False
    "style2=glass|isEnabled=true|destructive=false": __body4,
  };
  return (__impls[__vkey(props)] ?? __body2)();
}
export default ButtonLiquidGlassSymbol;
