// figma node: 148:8296 angle-up
export function AngleUp(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 24,
      height: 24,
      position: "relative",
      color: "var(--colors-text-text-heading)",
      ...props.style,
    }}>
      <svg width={16} height={9} viewBox="0 0 16 9" fill="none" style={{
        position: "absolute",
        left: 4,
        top: 7,
        width: 16,
        height: 9,
      }}>
        <path d={"M 7.293 0.293 C 7.683 -0.098 8.317 -0.098 8.707 0.293 L 15.707 7.293 C 16.098 7.683 16.098 8.317 15.707 8.707 C 15.317 9.098 14.683 9.098 14.293 8.707 L 8 2.414 L 1.707 8.707 C 1.317 9.098 0.683 9.098 0.293 8.707 C -0.098 8.317 -0.098 7.683 0.293 7.293 L 7.293 0.293 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
}
export default AngleUp;
