// figma node: 138:6428 chevron-right
export function ChevronRight(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 24,
      height: 24,
      position: "relative",
      color: "var(--colors-text-text-heading)",
      ...props.style,
    }}>
      <svg width={6} height={10} viewBox="0 0 6 10" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "matrix(-1,0,0,-1,15,17)",
        transformOrigin: "0 0",
        width: 6,
        height: 10,
      }}>
        <path d={"M 5.707 0.293 C 6.098 0.683 6.098 1.317 5.707 1.707 L 2.414 5 L 5.707 8.293 C 6.098 8.683 6.098 9.317 5.707 9.707 C 5.317 10.098 4.683 10.098 4.293 9.707 L 0.293 5.707 C -0.098 5.317 -0.098 4.683 0.293 4.293 L 4.293 0.293 C 4.683 -0.098 5.317 -0.098 5.707 0.293 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
}
export default ChevronRight;
