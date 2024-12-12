import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import List from "../components/List";
import Modal from "../components/Modal";
import { set } from "@cloudinary/url-gen/actions/variable";
import { Filter } from "bad-words";
import DOMPurify from "dompurify";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const makePost = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      console.log("Using token:", token);

      // Example: Sending the note to a backend API
      const response = await fetch("http://localhost:3004/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          date: new Date().toISOString(), // Example date
          title: title, // Replace with actual title
          content: note,
          likes: 0, // Default value
          dislikes: 0, // Default value
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post created:", result);
        setNote("");
        setTitle("");
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Failed to create post:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // * Filter out bad words & sanitize inputs
  const filter = new Filter();

  const handleTextareaChange = (event) => {
    const sanitizedNote = DOMPurify.sanitize(event.target.value);
    const filteredNote = filter.clean(sanitizedNote);
    setNote(filteredNote);
  };

  const handleTitleChange = (e) => {
    const sanitizedTitle = DOMPurify.sanitize(e.target.value);
    const filteredTitle = filter.clean(sanitizedTitle);
    setTitle(filteredTitle);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col sm:flex-row">
          <div className=" ml-10 mt-4 sm:mt-4 sm:w-full sm:mx-auto md:w-full md:mx-auto max-w-md">
            <List />
          </div>

          <div className="inline-block  sm:ml-20 mt-4 sm:mt-0">
            <div className="text-2xl text-center mb-10 sm:mt-0">
              <h2 className="mt-8 mb-8 text-gray-100 text-3xl sm:text-4xl md:text-5xl font-bold underline text-center transition-colors duration-300 hover:text-green-500">
                What we learned Today?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-col">
              <input
                type="text"
                placeholder="Enter Title"
                className="border-2 border-black focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none p-4 w-1/2 sm:w-3/4 md:w-2/3 lg:w-1/2 mb-8 sm:w-auto mx-auto bg-zinc-300 text-gray-900 placeholder-gray-500 rounded-lg shadow-md transition duration-300 ease-in-out text-xl"
                value={title}
                onChange={handleTitleChange}
              />
              <textarea
                className="flex border-2 border-black focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none p-4 mb-8 w-1/2 lg:w-3/4 md:w-2/3 sm:w-full mx-auto bg-zinc-300 text-gray-900 placeholder-gray-500 rounded-lg shadow-md transition duration-300 ease-in-out text-xl"
                placeholder="Write your notes here..."
                rows="22"
                cols="70"
                value={note}
                onChange={handleTextareaChange}
                style={{ resize: "none" }}
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white py-4 px-6  rounded-full mt-4 text-lg sm:text-xl md:text-2xl lg:text-2xl transition-transform duration-300 hover:scale-125 hover:bg-blue-500 cursor-pointer"
                onClick={makePost}
              >
                Make Post
              </button>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
          <div className="relative z-50 bg-gray-900  p-8 rounded-lg shadow-xl w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto text-gray-100 transform scale-95 transition-transform duration-300 ease-in-out min-h-[50vh] max-h-[90vh] overflow-y-auto">
            <h2 className="text-4xl font-bold mb-6 text-center">
              Welcome Programmer
            </h2>
            <p className=" text-lg mt-8 mb-6 text-center leading-relaxed">
              <span className="font-semibold text-gray-100">GET</span> is your
              personal digital diary and note-taking companion built especially
              for <em className="font-bold text-gray-200">coders</em>. Jot down your thoughts,
              document your journey, and share your ideas with the world. Let’s
              build something great together.
            </p>
            <div className="space-y-6 mt-10">
              <p className="flex items-center justify-center text-gray-100 text-lg font-semibold space-x-2 mt-6 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 hover:bg-green-600 hover:scale-105 transition-transform duration-300">
                First time? &nbsp;
                <span>
                  <button
                    className="text-xl text-gray-200 italic underline font-medium transition-transform duration-300 hover:scale-110 hover:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleRegister}
                  >
                    Sign up here
                  </button>
                </span>
              </p>

              <p className="flex items-center justify-center text-gray-100 text-lg font-semibold space-x-2 mt-6 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 hover:bg-green-600 hover:scale-105 transition-transform duration-300">
                For those coming back, &nbsp;
                <span>
                  <button
                    className="text-xl text-gray-200 italic underline font-medium transition-transform duration-300 hover:scale-110 hover:text-blue-500 hover:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleLogin}
                  >
                    Click here
                  </button>
                </span>
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                className="bg-blue-500 text-white  py-3 px-6 rounded-full font-bold text-lg shadow-md hover:scale-125 hover:bg-blue-600 transition-transform duration-300 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Home;
