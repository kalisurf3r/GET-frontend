import { useEffect, useState } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../components/animation.css";

function ViewProfile() {
  const location = useLocation();
  const [userData, setUserData] = useState(location.state || {});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState({});

  const commentImgStyle = {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #f1f1f1",
  };

  // * fetch user data
  useEffect(() => {
    if (!userData) {
      const getUser = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user.user.id;

        try {
          const response = await fetch(`http://localhost:3004/users/${id}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched user data:", data);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getUser();
    }
    console.log("User data:", userData);
  }, [userData]);

  // * fetch user's posts
  useEffect(() => {
    if (userData.userId) {
      const getPosts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3004/posts/user/${userData.userId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched user posts:", data);
          setPosts(data);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };

      getPosts();
    }
  }, [userData]);

  // * fetch comments on user's posts
  useEffect(() => {
    if (posts.length > 0) {
      const getComments = async (postId) => {
        try {
          const response = await fetch(
            `http://localhost:3004/comments/${postId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched user comments:", data);
          setComments((prevComments) => ({
            ...prevComments,
            [postId]: data,
          }));
        } catch (error) {
          console.error("Error fetching user comments:", error);
        }
      };

      posts.forEach((post) => {
        getComments(post.id);
      });
    }
  }, [posts]);

  // * toggle comments visibility
  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex">
        <h1 className="text-3xl text-white mt-4">{userData.userName}</h1>
        <img
          src={userData.imageUrl}
          alt="profile"
          className="w-20 h-20 rounded-full ml-4 mt-1"
        />
      </div>

      
        <div className="flex flex-col items-center">
          <p className="text-2xl mt-4">Posts:</p>
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              <div
                
                className="w-3/4 border-2 border-black border-dotted p-4 mb-6 mt-10"
              >
                <div className="flex justify-between border-2 border-black p-1">
                  <h1 className="ml-2">{post.title}</h1>
                </div>
                <p className="text-center mt-2">{post.content}</p>
                <button
                  className="flex justify-content mx-auto"
                  onClick={() => toggleComments(post.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    className="bi bi-body-text mt-2 mr-4 transition-transform duration-300 hover:scale-150"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                </button>
              </div>

              <div
                className="commentcontainer w-full flex justify-center items-center"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {commentsVisible[post.id] && (
                  <div className="mt-4">
                    <ul className="max-w-xs w-full">
                      <TransitionGroup>
                        {comments[post.id].slice(-5).map((comment, index) => (
                          <CSSTransition
                            key={comment.id}
                            timeout={500}
                            classNames="comment"
                          >
                            <li
                              key={comment.id}
                              className="comment-item border-t border-gray-300 py-1 flex items-center"
                            >
                              <img
                                src={comment.User.profilePic}
                                alt="Profile"
                                className="profile-pic mr-4 rounded-full"
                                style={commentImgStyle}
                              />

                              <div>
                                <h4 className="font-semibold">
                                  {comment.User.userName}
                                </h4>
                                <p>{comment.content}</p>
                              </div>

                              <div className="votes ml-8 flex items-center">
                                <span className="mr-1">{comment.likes}</span>

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-heart-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                  />
                                </svg>
                              </div>
                            </li>
                          </CSSTransition>
                        ))}
                      </TransitionGroup>
                    </ul>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    
  );
}

export default ViewProfile;
