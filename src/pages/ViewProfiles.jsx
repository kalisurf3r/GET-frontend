import { useEffect, useState } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../components/animation.css";
import sendEmail from "../components/Sendgrid";
import Modal from "../components/Modal";
import "../components/modal.css";

function ViewProfile() {
  // * fetch user data from location state
  const location = useLocation();
  const [userData, setUserData] = useState(location.state || {});
  const [posts, setPosts] = useState([]);

  // * fetch comments on user's posts
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const commentImgStyle = {
    width: "70px",
    height: "70px",
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

  // * send email
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.user.id;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3004/users/${id}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched subscription data:", data);
      const isUserSubscribed = data.some(
        (sub) => sub.subscribedTo === userData.userId
      );
      setIsSubscribed(isUserSubscribed);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  // * subscribe user to email notifications
  const handleSubscribe = () => {
    const subscribeUser = async () => {
      const subscribedTo = userData.userId;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3004/users/subscribe/${subscribedTo}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ subscribed: true }),
          }
        );

        if (response.ok) {
          console.log("Subscribed successfully");
          setIsSubscribed(true);
          setModalVisible(false);
        } else {
          console.error("Failed to subscribe");
        }
      } catch (error) {
        console.error("Error subscribing user:", error);
      }
    };
    subscribeUser();
    setModalVisible(false);
  };

  // * unsubscribe user
  const handleUnsubscribe = async () => {
    const subscribedTo = userData.userId;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3004/users/unsubscribe/${subscribedTo}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Unsubscribed successfully");
        setIsSubscribed(false);
        setModalVisible(false);
      } else {
        console.error("Failed to unsubscribe");
      }
    } catch (error) {
      console.error("Error unsubscribing user:", error);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  // * disable scrolling when modal is open
  useEffect(() => {
    if (modalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalVisible]);

  return (
    <div className="min-h-screen flex flex-col items-center relative z-[1]">
      <div className="flex justify-end w-full">
        <button className="mr-20 mt-4" onClick={toggleModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-envelope-plus w-[10vw] max-w-[80px] h-[10vw] max-h-[80px] text-blue-500  hover:animate-bounce transition-transform duration-300"
            viewBox="0 0 16 16"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
            <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5" />
          </svg>
        </button>

        {/* // * all modal styling is now in the modal.css file */}
        <Modal
          isOpen={modalVisible}
          onClose={toggleModal}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-75 z-[9998]"></div>

          {/* Modal */}
          <div className="relative flex flex-col justify-center items-center text-center bg-gray-900 p-8 rounded-lg shadow-xl w-full sm:w-10/12 md:w-4/5 lg:w-3/4 xl:w-3/5 2xl:w-1/2 mx-auto text-gray-100 transform scale-95 transition-transform duration-300 ease-in-out min-w-[35vh] max-w-[70vh] min-h-[40vh] max-h-[90vh] overflow-y-auto z-[9999]">
            <div
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 cursor-pointer"
              onClick={toggleModal}
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
            </div>

            {isSubscribed === false ? (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-center">
                  Receive email notifications?
                </h1>
                <h1 className="text-lg mb-6 text-center leading-relaxed">
                  Stay up to date with new posts from{" "}
                  <strong className="text-blue-300">{userData.userName}</strong>
                </h1>
                <button
                  onClick={handleSubscribe}
                  className="rounded-full px-6 py-3 bg-blue-500 text-white font-bold text-lg shadow-md hover:scale-125 hover:bg-blue-600 transition-transform duration-300 flex justify-center mx-auto"
                >
                  Enroll
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-center">
                  Unsubscribe from email notifications?
                </h1>
                <p className="text-lg mb-6 text-center leading-relaxed">
                  You will no longer receive updates from{" "}
                  <strong className="text-red-300">{userData.userName}</strong>.
                </p>
                <button
                  onClick={handleUnsubscribe}
                  className="rounded-full px-6 py-3 bg-red-500 text-white font-bold text-lg shadow-md hover:scale-125 hover:bg-red-600 transition-transform duration-300 flex justify-center mx-auto"
                >
                  Unsubscribe
                </button>
              </div>
            )}
          </div>
        </Modal>
      </div>
      <div className="flex">
        <h1 className="text-4xl lg:text-5xl font-semibold text-white mt-4">
          {userData.userName}
        </h1>

        {userData ? (
          <img
            src={
              userData.imageUrl === "./avatar.png"
                ? "/avatar.png"
                : userData.imageUrl
            }
            alt="profile"
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full ml-6 border-4 border-white shadow-lg"
          />
        ) : (
          <img
            src="/avatar.png"
            alt="profile"
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full ml-6 border-4 border-white shadow-lg"
          />
        )}
      </div>

      <div className="z-[2] relative sm:static sm:w-1/4 sm:left-0 lg:absolute lg:left-20 lg:top-30 lg:h-full ">
        <div className="flex flex-col p-2">
          <p className="underline text-2xl md:text-3xl lg:text-4xl font-medium text-center text-gray-200 my-4">
            Tags :
          </p>

          <ul className="flex flex-wrap gap-2 mt-4 ml-8 text-lg md:text-xl lg:text-2xl text-gray-800">
            {Array.isArray(userData.topics) && userData.topics.length > 0 ? (
              userData.topics.map((topic, index) => (
                <li
                  key={index}
                  className="bg-green-600 text-white text-center px-4 py-2 rounded-full shadow-md hover:bg-green-500 hover:scale-105 transition-transform duration-200 cursor-pointer"
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {topic}
                </li>
              ))
            ) : (
              <li className="text-gray-200">No topics available</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center z-[0] relative">
        <p className="text-4xl lg:text-5xl font-bold text-gray-200 mt-8 mb-4 text-center lg:text-left">
          Posts :
        </p>
        {posts.map((post) => (
          <React.Fragment key={post.id}>
            <div className="w-full  lg:w-4/5 xl:w-3/4 shadow-lg border-4 border-gray-200 border-dotted border-gray-800 hover:border-green-500 transition-colors duration-300 p-6 mb-6 mt-10 lg:scale-110 lg:p-8">
              <div className="flex flex-col justify-between border-2 border-gray-300 p-2 lg:p-6">
                <h1 className="ml-2 text-gray-200 text-2xl md:text-3xl lg:text-4xl font-bold ">
                  {post.title}
                </h1>
                <h1 className=" text-lg mt-4 md:text-xl lg:text-2xl font-bold text-gray-200 tracking-wide text-center break-words">
                  Topics:{" "}
                  {Array.isArray(post.topics)
                    ? post.topics.join(", ")
                    : "No topics"}
                </h1>
              </div>
              <p className="text-center mt-4 px-4 mt-2 text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed ">
                {post.content}
              </p>
              <button
                className="flex justify-content mx-auto mt-4 transition-transform duration-300 hover:scale-125"
                onClick={() => toggleComments(post.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-body-text mt-2 w-[8vw] max-w-[48px] h-[8vw] max-h-[48px] text-gray-300 hover:text-green-500"
                  viewBox="0 0 16 16"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </button>
            </div>

            <div
              className="commentcontainer w-full flex justify-center items-center z-[2] relative"
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
                            className="comment-item border-t border-gray-300 py-3 px-4 flex items-center space-x-4"
                          >
                            <img
                              src={
                                comment.User.profilePic
                                  ? comment.User.profilePic
                                  : "/avatar.png"
                              }
                              alt="Profile"
                              className="profile-pic mr-4 rounded-full"
                              style={commentImgStyle}
                            />

                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-200 text-lg md:text-xl lg:text-2xl">
                                {comment.User.userName}
                              </h4>
                              <p className="text-base text-gray-200 md:text-lg lg:text-xl">
                                {comment.content}
                              </p>
                            </div>

                            <div className="votes flex items-center">
                              <span className="text-lg text-gray-200 md:text-xl lg:text-2xl mr-2">
                                {comment.likes}
                              </span>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-heart-fill text-red-600"
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
