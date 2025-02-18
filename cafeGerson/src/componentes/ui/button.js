// src/components/ui/button.js
import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
};

export { Button };
