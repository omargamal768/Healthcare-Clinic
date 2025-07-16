import React from "react";

const Button = ({ children }) => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
      {children}
    </button>
  );
};

export default Button;
