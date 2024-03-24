import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  let inputRef = React.createRef();

  const handleSubmit = () => {
    const detail = inputRef.current.value;
    onSubmit(detail);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose}>Close</button>
        <h2>Enter Detail</h2>
        <input ref={inputRef} type="text" />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Modal;
