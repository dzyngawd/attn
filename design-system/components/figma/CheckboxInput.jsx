import { Check } from './Check.jsx';

// figma node: 147:7326 Checkbox input (12 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + '|' + "size=" + __venc(p.size) + '|' + "status=" + __venc(p.status) + '|' + "checked=" + __venc(p.checked);

export function CheckboxInput(_p = {}) {
  const props = { ..._p, type: _p.type ?? "checkbox input", size: _p.size ?? "base", status: _p.status ?? "initial", checked: _p.checked ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-base-strong)",
      borderRight: "1px solid var(--colors-border-border-base-strong)",
      borderBottom: "1px solid var(--colors-border-border-base-strong)",
      borderLeft: "1px solid var(--colors-border-border-base-strong)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-light)",
      borderRight: "1px solid var(--colors-border-border-light)",
      borderBottom: "1px solid var(--colors-border-border-light)",
      borderLeft: "1px solid var(--colors-border-border-light)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-brand)",
      borderTop: "1px solid var(--colors-border-border-brand)",
      borderRight: "1px solid var(--colors-border-border-brand)",
      borderBottom: "1px solid var(--colors-border-border-brand)",
      borderLeft: "1px solid var(--colors-border-border-brand)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          height: 16,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
          color: "var(--colors-text-text-white)",
        }}>{props.icon1 ?? <Check />}</div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-light)",
      borderRight: "1px solid var(--colors-border-border-light)",
      borderBottom: "1px solid var(--colors-border-border-light)",
      borderLeft: "1px solid var(--colors-border-border-light)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          height: 16,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
          color: "var(--colors-text-text-fg-disabled)",
        }}>{props.icon1 ?? <Check />}</div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-base-strong)",
      borderRight: "1px solid var(--colors-border-border-base-strong)",
      borderBottom: "1px solid var(--colors-border-border-base-strong)",
      borderLeft: "1px solid var(--colors-border-border-base-strong)",
      boxShadow: "0px 0px 0px 2px rgb(190,219,255)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--colors-background-bg-brand)",
      borderTop: "1px solid var(--colors-border-border-brand)",
      borderRight: "1px solid var(--colors-border-border-brand)",
      borderBottom: "1px solid var(--colors-border-border-brand)",
      borderLeft: "1px solid var(--colors-border-border-brand)",
      boxShadow: "0px 0px 0px 2px rgb(190,219,255)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          height: 16,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
          color: "var(--colors-text-text-white)",
        }}>{props.icon1 ?? <Check />}</div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-base-strong)",
      borderRight: "1px solid var(--colors-border-border-base-strong)",
      borderBottom: "1px solid var(--colors-border-border-base-strong)",
      borderLeft: "1px solid var(--colors-border-border-base-strong)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-base-strong)",
      borderRight: "1px solid var(--colors-border-border-base-strong)",
      borderBottom: "1px solid var(--colors-border-border-base-strong)",
      borderLeft: "1px solid var(--colors-border-border-base-strong)",
      boxShadow: "0px 0px 0px 2px rgb(190,219,255)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-light)",
      borderRight: "1px solid var(--colors-border-border-light)",
      borderBottom: "1px solid var(--colors-border-border-light)",
      borderLeft: "1px solid var(--colors-border-border-light)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }} />
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-brand)",
      borderRight: "1px solid var(--colors-border-border-brand)",
      borderBottom: "1px solid var(--colors-border-border-brand)",
      borderLeft: "1px solid var(--colors-border-border-brand)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--colors-background-bg-brand)",
        flexShrink: 0,
      }} />
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-brand)",
      borderRight: "1px solid var(--colors-border-border-brand)",
      borderBottom: "1px solid var(--colors-border-border-brand)",
      borderLeft: "1px solid var(--colors-border-border-brand)",
      boxShadow: "0px 0px 0px 2px rgb(190,219,255)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--colors-background-bg-brand)",
        flexShrink: 0,
      }} />
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      borderRadius: 9999,
      backgroundColor: "var(--colors-background-bg-secondary-strong)",
      borderTop: "1px solid var(--colors-border-border-light)",
      borderRight: "1px solid var(--colors-border-border-light)",
      borderBottom: "1px solid var(--colors-border-border-light)",
      borderLeft: "1px solid var(--colors-border-border-light)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--colors-background-bg-quaternary)",
        flexShrink: 0,
      }} />
    </div>
  );
  const __impls = {
    // figma: Type=Checkbox input, Size=base, Status=Initial, Checked=False
    "type=checkbox input|size=base|status=initial|checked=false": __body0,
    // figma: Type=Checkbox input, Size=base, Status=Disabled, Checked=False
    "type=checkbox input|size=base|status=disabled|checked=false": __body1,
    // figma: Type=Checkbox input, Size=base, Status=Initial, Checked=True
    "type=checkbox input|size=base|status=initial|checked=true": __body2,
    // figma: Type=Checkbox input, Size=base, Status=Disabled, Checked=True
    "type=checkbox input|size=base|status=disabled|checked=true": __body3,
    // figma: Type=Checkbox input, Size=base, Status=Focus, Checked=False
    "type=checkbox input|size=base|status=focus|checked=false": __body4,
    // figma: Type=Checkbox input, Size=base, Status=Focus, Checked=True
    "type=checkbox input|size=base|status=focus|checked=true": __body5,
    // figma: Type=Radio input, Size=Default, Status=Initial, Checked=False
    "type=radio input|size=default|status=initial|checked=false": __body6,
    // figma: Type=Radio input, Size=Default, Status=Focus, Checked=False
    "type=radio input|size=default|status=focus|checked=false": __body7,
    // figma: Type=Radio input, Size=Default, Status=Disabled, Checked=False
    "type=radio input|size=default|status=disabled|checked=false": __body8,
    // figma: Type=Radio input, Size=Default, Status=Initial, Checked=True
    "type=radio input|size=default|status=initial|checked=true": __body9,
    // figma: Type=Radio input, Size=Default, Status=Focus, Checked=True
    "type=radio input|size=default|status=focus|checked=true": __body10,
    // figma: Type=Radio input, Size=Default, Status=Disabled, Checked=True
    "type=radio input|size=default|status=disabled|checked=true": __body11,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default CheckboxInput;
