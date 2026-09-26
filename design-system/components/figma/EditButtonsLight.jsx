// figma node: 24:406 _Edit Buttons/Light (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function EditButtonsLight(_p = {}) {
  const props = { ..._p, state: _p.state ?? "selected" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 1px 0px 2px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 22,
        borderRadius: 100,
        backgroundColor: "var(--accents-red)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 22,
          height: 22,
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 590,
          fontSize: 14.5,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          color: "var(--grays-white)",
        }}>{props.text1 ?? "􀅽"}</span>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      padding: "0px 1px 0px 2px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 22,
        borderRadius: 100,
        backgroundColor: "var(--accents-green)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 22,
          height: 22,
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 590,
          fontSize: 14.5,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          color: "var(--grays-white)",
        }}>{props.text1 ?? "􀅼"}</span>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      padding: "0px 1px 0px 2px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 22,
        borderRadius: 100,
        backgroundColor: "var(--accents-blue)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 22,
          height: 22,
          fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 590,
          fontSize: 14.5,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          color: "var(--grays-white)",
        }}>{props.text1 ?? "􀆅"}</span>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 1px 0px 2px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <svg width={22} viewBox="0 0 22 22" fill="none" style={{
        position: "relative",
        width: 22,
        borderRadius: 100,
        flexShrink: 0,
        alignSelf: "stretch",
        color: "var(--grays-gray-3)",
      }}>
        <path d={"M 11 22 L 11 20.5 C 5.753 20.5 1.5 16.247 1.5 11 L 0 11 L -1.5 11 C -1.5 17.904 4.096 23.5 11 23.5 L 11 22 Z M 22 11 L 20.5 11 C 20.5 16.247 16.247 20.5 11 20.5 L 11 22 L 11 23.5 C 17.904 23.5 23.5 17.904 23.5 11 L 22 11 Z M 11 0 L 11 1.5 C 16.247 1.5 20.5 5.753 20.5 11 L 22 11 L 23.5 11 C 23.5 4.096 17.904 -1.5 11 -1.5 L 11 0 Z M 11 0 L 11 -1.5 C 4.096 -1.5 -1.5 4.096 -1.5 11 L 0 11 L 1.5 11 C 1.5 5.753 5.753 1.5 11 1.5 L 11 0 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __impls = {
    // figma: State=Remove
    "state=remove": __body0,
    // figma: State=Add
    "state=add": __body1,
    // figma: State=Selected
    "state=selected": __body2,
    // figma: State=Unselected
    "state=unselected": __body3,
  };
  return (__impls[__vkey(props)] ?? __body2)();
}
export default EditButtonsLight;
