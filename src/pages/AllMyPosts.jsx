import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UploadWidget from "../components/Cloudinary";
import { set } from "@cloudinary/url-gen/actions/variable";
import Modal from "../components/Modal";
import { UserContext } from "../components/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import YTPreview from "../components/YTPreview";
import LinkPreview from "../components/LinkPreview";
import DELposts from "../components/DELposts";

function AllMyPosts(user) {
  // * carry user data from context
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  // * states for loading posts
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // * updating user profile
  const [newEmail, setNewEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");

  // * grab all posts by user id
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const id = user.user.id;

        const response = await fetch(`http://localhost:3004/posts/user/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched post data:", data);
        setPost(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  // * update / edit post

  const [edit, setEdit] = useState(false);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });

  const handleEditClick = (post) => {
    if (editingPostId === post.id) {
      setEditingPostId(null);
    } else {
      setEditingPostId(post.id);
      setEditedPost({ title: post.title, content: post.content });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  // * save edited post
  const handleSaveClick = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3004/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedPost.title,
          content: editedPost.content,
          date: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Updated post data:", data);
      // * Update the post in the state
      setPost((prevPosts) =>
        prevPosts.map((p) => (p.id === post.id ? data : p))
      );
      setEditingPostId(null);
      window.location.reload();
    } catch (error) {
      console.error("There was an error updating the post:", error);
      setEditingPostId(null);
    }
  };

  // * open modal to view profile settings
  const [showSettings, setShowSettings] = useState(false);

  // * restrict scrolling when modal is open
  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSettings]);

  // * setting new user data
  const [userData, setUserData] = useState({
    email: "",
    userName: "",
    password: "",
    profilePic: "",
  });

  // * setting initial user data
  const [originalUserData, setOriginalUserData] = useState({
    email: "",
    userName: "",
    password: "",
    profilePic: "",
  });

  // * handle image upload
  const [profilePic, setProfilePic] = useState("");
  const handleImageUpload = (url) => {
    setProfilePic(url);
    setUserData((prevData) => ({
      ...prevData,
      profilePic: url,
    }));
  };

  // * open settings load
  const handleSettingsOpenClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user.user.id;

    try {
      const response = await fetch(`http://localhost:3004/users/${id}`);
      if (!response.ok) {
        console.error("Response status:", response.status);
        console.error("Response body:", await response.text());
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched user data:", data);
      setUserData(data);
      setOriginalUserData(data);
      setProfilePic(data.profilePic);
      setShowSettings(true);
    } catch (error) {
      console.error("There was an error opening the settings:", error);
    }
  };

  // * save settings
  const handleSettingsSaveClick = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!userData || !originalUserData) {
      console.error("userData or originalUserData is undefined");
      setError("User data is not available");
      return;
    }

    const updatedData = {};

    if (userData.email !== originalUserData.email) {
      updatedData.email = userData.email;
    }

    if (userData.userName !== originalUserData.userName) {
      updatedData.userName = userData.userName;
    }
    if (userData.password && userData.password !== originalUserData.password) {
      updatedData.password = userData.password;
    }
    if (userData.profilePic !== originalUserData.profilePic) {
      updatedData.profilePic = userData.profilePic;
    }

    if (Object.keys(updatedData).length === 0) {
      setError("No changes to save");
      window.location.reload();
      return;
    }

    console.log("Updated data:", updatedData);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const id = user.user.id;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage");
      }

      console.log("Sending request to update user:", {
        id,
        token,
        email: userData.email,
        userName: userData.userName,
        profilePic: userData.profilePic,
      });

      const response = await fetch(`http://localhost:3004/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.log("Response text:", responseText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Updated user data:", data);
      localStorage.setItem("user", JSON.stringify(data));
      setOriginalUserData({ ...originalUserData, ...updatedData });

      setShowSettings(false);
      navigate("/");
    } catch (error) {
      console.error("There was an error updating the user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center overflow-y-auto">
      <div className="settings mt-2 pl-8 w-full flex justify-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-gear text-gray-200 hover:text-blue-500 transition-transform duration-300 hover:scale-125"
          viewBox="0 0 16 16"
          onClick={handleSettingsOpenClick}
        >
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
        </svg>
        {showSettings && (
          <Modal
            className="modal z-50 "
            isOpen={showSettings}
            onRequestClose={() => setShowSettings(false)}
          >
            <div className="modal-content">
              <span className="close" onClick={() => setShowSettings(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x-lg hover:fill-red-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </span>
              <form
                onSubmit={handleSettingsSaveClick}
                className="flex flex-col space-y-6 my-4"
              >
                <label className="flex flex-col">
                  <span className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="py-3 px-4 w-full border border-gray-300 rounded-lg text-base md:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                    Username
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={userData.userName}
                    onChange={(e) =>
                      setUserData({ ...userData, userName: e.target.value })
                    }
                    className="py-3 px-4 w-full border border-gray-300 rounded-lg text-base md:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your username"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    className="py-3 px-4 w-full border border-gray-300 rounded-lg text-base md:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your password"
                  />
                </label>
                <label className="mb-2 text-lg md:text-xl font-medium text-gray-700">
                  Profile Picture: &nbsp;
                  <UploadWidget onUpload={handleImageUpload} />
                  <div className="flex justify-center">
                    {profilePic ? (
                      <img
                        id="profileImgContainer"
                        alt="Profile Image Preview"
                        className="w-20 h-20 mt-4 rounded-full border-2 border-black"
                        src={profilePic}
                      />
                    ) : (
                      <svg
                        id="profileImgContainer"
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        fill="currentColor"
                        className="bi bi-person-bounding-box mt-4 w-20 h-20 rounded-full border-2 border-black"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      </svg>
                    )}
                  </div>
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 text-white text-center text-xl py-2 px-2 rounded-full mt-8 transition-transform duration-300 shadow-lg hover:bg-blue-600  hover:scale-105"
                >
                  Save
                </button>
              </form>
            </div>
          </Modal>
        )}
      </div>
      <div className="flex flex-col items-center w-full max-w-4xl overflow-hidden">
        {post.map((post) => (
          <div
            key={post.id}
            className="w-full  max-w-4xl lg:w-3/4 xl:w-2/3 mx-auto shadow-lg border-4 border-gray-200 border-dotted hover:border-green-500 transition-colors duration-300 p-4 mb-6 mt-10 lg:scale-110 lg:p-8"
          >
            <div className="relative">
              <button
                onClick={() => handleEditClick(post)}
                className="absolute top-2 right-1 py-2 px-3 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 hover:shadow-lg transition-transform duration-300 flex justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-pencil mr-2 text-gray-200 transition-transform duration-300 hover:scale-125"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col w-full space-y-4 p-4  border-2 border-gray-300 shadow-lg">
              {editingPostId === post.id ? (
                <input
                  type="text"
                  name="title"
                  value={editedPost.title}
                  onChange={handleInputChange}
                  className="w-full py-2 px-4 text-lg font-semibold text-gray-900 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder-gray-400"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-200 mt-2 ml-2 tracking-wide ">
                  {post.title}
                </h1>
              )}
              <h1 className=" text-xl mt-4 md:text-2xl lg:text-3xl font-bold text-gray-200 tracking-wide text-center">
                {" "}
                Topics:{" "}
                {Array.isArray(post.topics)
                  ? post.topics.join(", ")
                  : "No topics"}
              </h1>
            </div>
            {editingPostId === post.id ? (
              <textarea
                name="content"
                value={editedPost.content}
                onChange={handleInputChange}
                className="w-full py-2 px-4 text-base text-gray-900 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder-gray-400 resize-none "
              />
            ) : (
              <div>
                <p className="text-center text-lg md:text-xl lg:text-2xl text-gray-300 mt-4 leading-relaxed transition-transform duration-300 hover:scale-105">
                  {post.content}
                </p>
                <LinkPreview url={post.content} />
                <DELposts postId={post.id} />
              </div>
            )}
            {editingPostId === post.id && (
              <button
                onClick={() => handleSaveClick(post.id)}
                className="mt-2 px-6 py-3 text-lg font-semibold  text-gray-100 bg-blue-500 rounded-full hover:bg-blue-600 shadow-lg  transition-transform duration-300 hover:scale-110"
              >
                Save
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllMyPosts;
