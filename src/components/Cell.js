import React, { forwardRef } from "react";
import Github from "./Github";
import LinkedIn from "./LinkedIn";

const Cell = forwardRef(({ text, id }, ref) => {
  if (text.toLowerCase().includes("github")) {
    return (
      <div className="cell" ref={ref}>
        <Github />
      </div>
    );
  }
  if (text.toLowerCase().includes("linkedin")) {
    return (
      <div className="cell" ref={ref}>
        <LinkedIn />
      </div>
    );
  }

  return (
    <div className="cell" ref={ref}>
      <p>{text}</p>
    </div>
  );
});

export default Cell;
