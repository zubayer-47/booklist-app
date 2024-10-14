import React from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="tooltip">
      {children}
      <div className="tooltiptext" style={{ pointerEvents: "none" }}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
