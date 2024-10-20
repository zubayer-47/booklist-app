import ReactDOM from "react-dom";
import EllipsisIndicator from "./EllipsisIndicator";

export default function Fallback() {
  return (
    <>
      {ReactDOM.createPortal(
        <div className="flex flex-col items-center justify-center custom-h">
          <EllipsisIndicator />
        </div>,
        document.body
      )}
    </>
  );
}
