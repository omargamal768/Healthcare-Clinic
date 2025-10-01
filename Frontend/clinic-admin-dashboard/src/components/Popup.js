// src/components/Popup.jsx
import React, { useEffect, useRef } from 'react';
import "../styles/Popup.css"; // ⬅️ Import the CSS file

const Popup = ({ children, isVisible, onClose }) => {
  // Use a ref to reference the popup's content element.
  const popupRef = useRef(null);

  // This effect handles closing the popup when clicking outside of it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If the click is outside the popup and it's currently visible, close it.
      if (popupRef.current && !popupRef.current.contains(event.target) && isVisible) {
        onClose();
      }
    };

    // Add event listener when the component mounts.
    document.addEventListener('mousedown', handleOutsideClick);

    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isVisible, onClose]); // Re-run effect if isVisible or onClose changes.

  // Don't render anything if the popup is not visible.
  if (!isVisible) {
    return null;
  }

  // The main structure of the popup.
  return (
    <div className="popup-overlay">
      <div ref={popupRef} className="popup-content">
        {children}
        <button onClick={onClose} className="close-button">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Popup;