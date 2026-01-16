import React from "react";

const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      {children}
    </button>
  );
};


export default Button;
