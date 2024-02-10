import React, { useEffect } from "react";
import "./CustomModal.css";

const CustomModal = (props) => {
  const modalStyle = {
    maxWidth: "980px",
    width: "100%",
  };

  const mediaQueryLarge = window.matchMedia("(min-width: 1200px)");

  if (mediaQueryLarge.matches) {
    modalStyle.maxWidth = "1800px";
  } else {
    modalStyle.height = "600px";
  }

  // Close the modal when clicking on the dark background
  const handleBackgroundClick = (event) => {
    if (event.target.classList.contains("custom-modal")) {
      props.toggle();
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleBackgroundClick);
    
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleBackgroundClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <div className="custom-modal" onClick={handleBackgroundClick}>
      <div className="modal-content" style={modalStyle}>
        <span className="close-button" onClick={props.toggle}>
          &times;
        </span>
        <hr style={{ paddingBottom: "5px" }} />
        <div className="modal-body">{props.children}</div>
      </div>
    </div>
  );
};

export default CustomModal;