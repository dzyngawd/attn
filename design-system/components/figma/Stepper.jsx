import { Decrement } from './Decrement.jsx';
import { Increment } from './Increment.jsx';

// figma node: 24:494 Stepper (1 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "mode=" + __venc(p.mode);

export function Stepper(_p = {}) {
  const props = { ..._p, mode: _p.mode ?? "light" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 92,
      height: 32,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 45.5,
        top: 4,
        width: 1,
        height: 24,
        borderRadius: 8,
        backgroundColor: "rgba(60,60,67,0.3)",
      }} />
      <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 46,
          height: 32,
        }}>{props.icon1 ?? <Decrement style2={"default"} />}</div>
      <div style={{
          position: "absolute",
          left: 46,
          top: 0,
          width: 46,
          height: 32,
        }}>{props.icon2 ?? <Increment style2={"default"} />}</div>
    </div>
  );
  const __impls = {
    // figma: Mode=Light
    "mode=light": __body0,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Stepper;
