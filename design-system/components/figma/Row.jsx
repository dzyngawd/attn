import { Grabber } from './Grabber.jsx';
import { ImagesRegular } from './ImagesRegular.jsx';
import { ImagesTall } from './ImagesTall.jsx';
import { Separator } from './Separator.jsx';
import { Trailing } from './Trailing.jsx';

// figma node: 24:592 Row (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "height=" + __venc(p.height);

export function Row(_p = {}) {
  const props = { ..._p, showEditButton: _p.showEditButton ?? false, showImage: _p.showImage ?? false, height: _p.height ?? "regular", showSubtitle: _p.showSubtitle ?? true, showTrailing: _p.showTrailing ?? true, showGrabber: _p.showGrabber ?? false, title: _p.title ?? "Title", subtitle: _p.subtitle ?? "Subtitle" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 300,
      height: 68,
      display: "flex",
      flexDirection: "row",
      padding: "0px 16px 0px 16px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      {props.showEditButton && (
      <div style={{
        position: "relative",
        width: 37,
        display: "flex",
        flexDirection: "row",
        padding: "0px 16px 0px 0px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          padding: "0px 1px 0px 2px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 22,
            height: 22,
            borderRadius: 100,
            backgroundColor: "var(--accents-blue)",
            flexShrink: 0,
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
            }}>􀆅</span>
          </div>
        </div>
      </div>
      )}
      {props.showImage && (
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "0px 8px 0px 0px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 68,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}>{props.icon2 ?? <ImagesTall type={"fill"} />}</div>
      </div>
      )}
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "0px 0px 1px 0px",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <Separator
          style={{
            position: "relative",
            height: 1,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          mode={"light"}
        />
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "nowrap",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            height: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 17,
              whiteSpace: "nowrap",
              lineHeight: "22px",
              letterSpacing: "-0.430px",
              color: "var(--labels-primary)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.title}</span>
            {props.showSubtitle && (
            <span style={{
              position: "relative",
              fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 15,
              whiteSpace: "nowrap",
              lineHeight: "20px",
              letterSpacing: "-0.230px",
              color: "rgba(60,60,67,0.6)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.subtitle}</span>
            )}
          </div>
          {props.showTrailing && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{ position: "relative", width: 68, flexShrink: 0 }}>{props.icon3 ?? <Trailing showSymbol={false} showCheckmark={false} showInfo={false} type={"default"} />}</div>
            {props.showGrabber && (
            <div style={{
                position: "relative",
                width: 22,
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon4 ?? <Grabber />}</div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 300,
      height: 52,
      display: "flex",
      flexDirection: "row",
      padding: "0px 16px 0px 16px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      {props.showEditButton && (
      <div style={{
        position: "relative",
        width: 37,
        height: 44,
        display: "flex",
        flexDirection: "row",
        padding: "0px 16px 0px 0px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          padding: "0px 1px 0px 2px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 22,
            height: 22,
            borderRadius: 100,
            backgroundColor: "var(--accents-blue)",
            flexShrink: 0,
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
            }}>􀆅</span>
          </div>
        </div>
      </div>
      )}
      {props.showImage && (
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "0px 8px 0px 0px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 52,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}>{props.icon2 ?? <ImagesRegular type={"fill"} />}</div>
      </div>
      )}
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "0px 0px 1px 0px",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <Separator
          style={{
            position: "relative",
            height: 1,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          mode={"light"}
        />
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "nowrap",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 17,
            whiteSpace: "nowrap",
            lineHeight: "22px",
            letterSpacing: "-0.430px",
            color: "var(--labels-primary)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>{props.title}</span>
          {props.showTrailing && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <Trailing
              style={{ position: "relative", width: 106, flexShrink: 0 }}
              showCheckmark={false}
              showInfo={false}
              type={"default"}
            />
            {props.showGrabber && (
            <div style={{
                position: "relative",
                width: 38,
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon3 ?? <Grabber />}</div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Height=Tall
    "height=tall": __body0,
    // figma: Height=Regular
    "height=regular": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Row;
