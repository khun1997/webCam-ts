import React from "react";
import "./style.css";

type BtnProps = {
  value: "Capture" | "ReCapture";
  onClick: () => void;
};

const Button: React.FC<BtnProps> = React.memo(({ value, onClick }) => {
  return (
    <div className="btnContainer" onClick={onClick}>
      <button className="btn" >{value}</button>
    </div>
  );
});

export default Button;
