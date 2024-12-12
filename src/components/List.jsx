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
        console.log("User object from localStorage:", user);

        if (!user || !user.user || !user.user.id) {
          console.error("Invalid user object or userId missing:", user);
          return;
        }

        const userId = user.user.id;
        console.log("Extracted userId:", userId);

        const response = await fetch(`http://localhost:3004/users/${userId}`);

        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return;
        }

        if (response.ok) {
          const userData = await response.json();
          console.log("Fetched user data from API:", userData);
          // const userIdFromPosts = userData.Posts.user_id;
          setUserId(userData.id);
          console.log("Updated userId state to:", setUserId);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("userId in useEffect:", userId);
        const response = await fetch(
          `http://localhost:3004/posts/user/${userId}`
        );

        if (!response.ok) {
          console.error("Error fetching posts:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Fetched posts data:", data);

        if (Array.isArray(data)) {
          setPosts(data);
          setDisplayPosts(true);
        } else if (data.Posts && Array.isArray(data.Posts)) {
          setPosts(data.Posts);
          setDisplayPosts(true);
        } else {
          console.warn(
            "Unexpected data format, setting posts to an empty array."
          );
          setPosts([]);
          setDisplayPosts(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setDisplayPosts(false);
      }
    };

    if (userId) {
      console.log("Fetching posts for user ID:", userId);
      setDisplayPosts(true);
      fetchPosts();
    }
  }, [userId]);

  return (
    <div className="min-h-full flex flex-col p-6 border-4 border-gray-200 border-dashed rounded-lg shadow-lg mt-10 sm:mt-10 sm:mr-4 sm:p-2 md:p-4 lg:p-6">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-100 underline mt-4 md:mt-6 lg:mt-8 text-center transition-colors duration-300 hover:text-green-500">
        Most Recent:
      </h3>

      {loggedIn && displayPosts && posts.length > 0 && (
        <ul className=" mt-6  text-2xl space-y-4 sm:mt-2 sm:text-xl sm:space-y-2 md:mt-4 md:text-2xl md:space-y-4">
          {posts.slice(0, 5).map((post) => (
            <li
              key={post.id}
              className="text-gray-100 text-center font-medium hover:text-green-500 transition-colors duration-300"
            >
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer">
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200 mt-4 md:mt-6 lg:mt-8 text-center ">
          <Link to={`/posts/user/${userId}`}>See all my Posts</Link>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-archive-fill text-gray-200 ml-2 mt-6 w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10  transition-transform duration-300"
          viewBox="0 0 16 16"
        >
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
        </svg>
      </div>

      <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer">
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200 mt-4 md:mt-6 lg:mt-8 text-center">
          <Link to={`/public`}>Public Dashboard</Link>
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-file-code-fill text-gray-200 ml-2 mt-6 w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10  transition-transform duration-300"
          viewBox="0 0 16 16"
        >
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 8 8.646 6.354a.5.5 0 1 1 .708-.708" />
        </svg>
      </div>
    </div>
  );
}

export default List;
