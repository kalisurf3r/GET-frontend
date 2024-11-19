import Modal from "./Modal";

function Comment () {
  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
    <h2 className="text-2xl mb-4">Welcome Programmer</h2>
    <p>
      Coder’s Journey is a digital diary or note taker. Make notes for
      yourself and see how others are creating.
    </p>
    <br></br>
    <p>
      First time?{" "}
      <a href="">
        <span className="italic" onClick={handleRegister}>
          Sign up here
        </span>
      </a>
    </p>

    <br></br>

    <p>
      For those coming back,{" "}
      <a href="">
        <span className="italic" onClick={handleLogin}>
          Click here
        </span>
      </a>
    </p>

    <button
      className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4"
      onClick={closeModal}
    >
      Close
    </button>
  </Modal>
  );
}

export default Comment;