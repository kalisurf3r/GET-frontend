import ReactDOM from "react-dom";

function Modal({ isOpen, onClose, children, style }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]"
      onClick={onClose} // Closes the modal when clicking outside
    >
      <div
        className="relative p-6 rounded shadow-lg z-[9999]"
        style={style}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        {/* <button
          className="absolute top-2 right-2 z-[10000] text-xl font-bold text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button> */}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") // Ensures modal is rendered at the root level
  );
}

export default Modal;
