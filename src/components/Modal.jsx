
function Modal({ isOpen, onClose, children, style }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg" style={style}>
          <button className="absolute top-2 right-2" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  
  export default Modal;