// figma node: 147:7312 check
export function Check(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 24,
      height: 24,
      position: "relative",
      color: "var(--colors-text-text-heading)",
      ...props.style,
    }}>
      <svg width={16} height={11} viewBox="0 0 16 11" fill="none" style={{
        position: "absolute",
        left: 4,
        top: 6.5,
        width: 16,
        height: 11,
      }}>
        <path d={"M 15.718 0.304 C 16.102 0.7 16.093 1.333 15.696 1.718 L 6.42 10.718 C 6.032 11.094 5.416 11.094 5.028 10.718 L 0.304 6.135 C -0.093 5.75 -0.102 5.117 0.282 4.721 C 0.667 4.324 1.3 4.315 1.696 4.699 L 5.724 8.607 L 14.304 0.282 C 14.7 -0.102 15.333 -0.093 15.718 0.304 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
}
export default Check;
