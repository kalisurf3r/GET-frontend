import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import List from "../components/List";
import Modal from "../components/Modal";
import { set } from "@cloudinary/url-gen/actions/variable";
import {Filter} from "bad-words";
import DOMPurify from "dompurify";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
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
              <h2 className="mt-6">What we learned Today?</h2>
            </div>

            <div  className="flex flex-col sm:flex-col">
              <input
                type="text"
                placeholder="Enter Title"
                className="border-2 border-black w-1/2 mb-2 sm:w-auto mx-auto  bg-zinc-300"
                value={title}
                onChange={handleTitleChange}
              />
              <textarea
                className="flex border-2 border-black w-1/2 sm:w-auto mx-auto  bg-zinc-300"
                placeholder="Write your notes here..."
                rows="22"
                cols="60"
                value={note}
                onChange={handleTextareaChange}
                style={{ resize: 'none' }}
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4 transition-transform duration-300 hover:scale-125 cursor-pointer"
                onClick={makePost}
              >
                Make Post
              </button>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} >
          <h2 className="text-2xl mb-4">Welcome Programmer</h2>
          <p>
            GET is a digital diary or note taker for <em className="font-semibold">Coders</em>. Make notes for
            yourself and share them with the world. Help each other grow.
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
      </div>
    </>
  );
}

export default Home;
