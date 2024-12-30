import React, { useState, useEffect } from "react";
import Modal from "./Modal";

function DELposts({ postId, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3004/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You are not authorized to delete this post.");
        } else if (response.status === 404) {
          throw new Error("Post not found.");
        } else {
          throw new Error("Failed to delete post.");
        }
      }

      const data = await response.json();
      isModalOpen(false);
      window.location.reload();
      console.log("Post deleted:", data);

      if (onDelete) {
        onDelete(postId);
      }
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // * Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <div>
      {/* Delete Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 hover:shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-trash3"
          viewBox="0 0 16 16"
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
        </svg>
        Delete
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
          <div className="relative z-50 bg-gray-900  p-8 rounded-lg shadow-xl w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto text-gray-100 transform scale-95 transition-transform duration-300 ease-in-out min-h-[50vh] max-h-[90vh] overflow-y-auto">
            {/* Cancel Button at Top Left */}
            <button
              onClick={() => isModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-200 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>

            {/* Modal Content */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-100 mt-10">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-6">
              {/* Confirm Button */}
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white mt-10 py-3 px-6 rounded-lg hover:bg-red-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg md:text-xl lg:text-2xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DELposts;
