import { set } from "@cloudinary/url-gen/actions/variable";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function List() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [displayPosts, setDisplayPosts] = useState(false);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!localStorage.getItem("user")) {
          console.log("No user data found in localStorage");
          return;
        }

        const userId = user.id;

        if (userId) {
          setUserId(userId);
        }

        const response = await fetch(`http://localhost:3004/users/${userId}`);

        if (response.ok) {
          const userData = await response.json();
          console.log("Fetched user data from API:", userData);
          setLoggedIn(true);
          fetchPosts(userData.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  const fetchPosts = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3004/posts/user/${userId}`
      );
      const data = await response.json();
      console.log("Fetched posts data:", data);
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.log("Unexpected data format, setting posts to an empty array");
        setPosts([]); // Ensure posts is always an array
      }
      setDisplayPosts(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Ensure posts is always an array
    }
  };

  return (
    <div className="min-h-full flex flex-col p-6 border-2 border-black mt-10 sm:mt-10 sm:mr-4 sm:p-2 md:p-4 lg:p-6">
      <h3 className="text-xl sm:text-lg md:text-xl">Most Recent :</h3>

      {loggedIn && displayPosts && (
        <ul className="list-disc ml-4 mt-4 text-xl space-y-4 sm:mt-2 sm:text-lg sm:space-y-2 md:mt-4 md:text-xl md:space-y-4">
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>{post.content}</Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center text-xl mt-2 sm:text-lg sm:mt-1 md:text-xl md:mt-2 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <h3 className="mr-2 ">
          <Link to={`/posts/user/${userId}`}>See all my Posts</Link>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-archive-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
        </svg>
      </div>

      <div className="flex items-center text-xl mt-2 sm:text-lg sm:mt-1 md:text-xl md:mt-2 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <h3>
          <Link to={`/public`}>See how others are Doing</Link>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-file-code-fill"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 8 8.646 6.354a.5.5 0 1 1 .708-.708" />
        </svg>
      </div>
    </div>
  );
}

export default List;
