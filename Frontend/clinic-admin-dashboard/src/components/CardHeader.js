import React from "react";

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`border-b pb-2 mb-3 text-lg font-semibold ${className}`}>
      {children}
    </div>
  );
};

export default CardHeader;
