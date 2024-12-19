import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import List from "../components/List";
import Modal from "../components/Modal";
import { set } from "@cloudinary/url-gen/actions/variable";
import { Filter } from "bad-words";
import DOMPurify from "dompurify";
import TopicPosts from "../components/TopicPosts";
import YouTubePreview from "../components/YTPreview";

// todo: work on previews
import { getLinkPreview } from "link-preview-js";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // * Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  // * Check if user is logged in to show modal
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // * navigate to different pages
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  // * states to store note title topics
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([]);
  // * for youtube video preview
  const [oEmbedData, setOEmbedData] = useState(null);
  // * for any link preview
  const [linkPreview, setLinkPreview] = useState(null);

  // * function to create a post
  const makePost = async () => {
    try {
      console.log("Topics at the time of submission:", topics);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      console.log("Using token:", token);

      const response = await fetch("http://localhost:3004/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          date: new Date().toISOString(),
          title: title,
          content: note,
          likes: 0,
          dislikes: 0,
          topics: topics,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post created:", result);
        setNote("");
        setTitle("");
        setTopics([]);
        setOEmbedData(null);
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

  const fetchOEmbed = async (url) => {
    console.log("fetchOEmbed called with URL:", url);
    try {
      // Regular expression to extract YouTube video ID
      const urlRegex =
        /(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+))/;
      const match = url.match(urlRegex);
  
      if (!match || !match[3]) {
        console.error("Invalid YouTube URL:", url);
        return;
      }
  
      const videoId = match[3]; // Extract video ID
      const validUrl = `https://www.youtube.com/watch?v=${videoId}`; // Format URL
  
      // Construct the oEmbed API endpoint
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${validUrl}&format=json`;
  
      console.log("Fetching oEmbed URL:", oEmbedUrl); // Debugging
  
      // Fetch oEmbed data
      const response = await fetch(oEmbedUrl);
  
      if (response.ok) {
        const data = await response.json();
        setOEmbedData(data); // Update state with oEmbed data
        console.log("oEmbed Data:", data);
      } else {
        console.error(
          `Failed to fetch oEmbed data. Status: ${response.status}, URL: ${oEmbedUrl}`
        );
        setOEmbedData(null);
        alert("The video might be restricted or unavailable.");
      }
    } catch (error) {
      console.error("Error fetching oEmbed data:", error);
      setOEmbedData(null);
      alert("An error occurred. Please check the video link.");
    }
  };

  // * get link preview
  const getPreview = async (url) => {
    try {
      console.log("Fetching preview for URL:", url);
  
      const response = await fetch(`http://localhost:3004/posts/proxy/preview?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch preview. Status: ${response.status}`);
      }
  
      const preview = await response.json();
      setLinkPreview(preview); // Update state with preview data
      console.log("Preview:", preview);
    } catch (error) {
      console.error("Error fetching link preview:", error);
      setLinkPreview(null);
    }
  };


  const handleTextareaChange = (event) => {
    const sanitizedNote = DOMPurify.sanitize(event.target.value);
    const filteredNote = filter.clean(sanitizedNote);
    setNote(filteredNote);

    // * Detect YouTube link
    const urlRegex =
  /(https?:\/\/(?:www\.)?(youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+))(?:\?.*)?/g;
    const match = filteredNote.match(urlRegex);

   // * detect any link
   const urlRegex2 = /(https?:\/\/\S+)/g;
    const match2 = filteredNote.match(urlRegex2);

    // * for youtube video preview
    if (match) {
      console.log("Calling fetchOEmbed with URL:", match[0]);
      fetchOEmbed(match[0]);
    } else {
      console.log("No valid YouTube URL detected.");
      setOEmbedData(null);
    }

    // * for any link preview
    if (match2) {
      console.log("Calling getPreview with URL:", match2[0]);
      getPreview(match2[0]);
    } else {
      console.log("No valid URL detected.");
      setLinkPreview(null);
    }

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
              {/* oEmbed Preview */}
              {oEmbedData && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    {oEmbedData.title}
                  </h3>
                  <img
                    src={oEmbedData.thumbnail_url}
                    alt={oEmbedData.title}
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <a
                    href={oEmbedData.url || note.match(/https?:\/\/\S+/)?.[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 underline text-lg"
                  >
                    Watch on YouTube
                  </a>
                </div>
              )}
              {/* Link Preview */}
              {linkPreview && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    {linkPreview.title}
                  </h3>
                  {linkPreview.image && (
                    <img
                      src={linkPreview.image}
                      alt={linkPreview.title}
                      className="w-full h-auto rounded-lg mb-4"
                    />
                  )}
                  <a
                    href={linkPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 underline text-lg"
                  >
                    {linkPreview.url}
                  </a>
                  <p className="text-gray-400 text-lg mt-2">
                    {linkPreview.description}
                  </p>
                </div>
              )}
            </div>

            <TopicPosts setTopics={setTopics} />

            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white py-4 px-6  rounded-full mt-4 mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl transition-transform duration-300 hover:scale-125 hover:bg-blue-500 cursor-pointer"
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
              for <em className="font-bold text-gray-200">coders</em>. Jot down
              your thoughts, document your journey, and share your ideas with
              the world. Let’s build something great together.
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
