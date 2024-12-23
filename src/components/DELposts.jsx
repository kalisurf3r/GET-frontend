import React, { useState, useEffect } from "react";

function DELposts({ postId, onDelete }) {
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
      window.location.reload();
      console.log("Post deleted:", data);

      if (onDelete) {
        onDelete(postId);
      }
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
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
      </button>
    </div>
  );
}

export default DELposts;
