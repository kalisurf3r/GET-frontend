import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { set } from "@cloudinary/url-gen/actions/variable";

function Navbar() {
  // * states to store user data
  const [profilePic, setProfilePic] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isHandlingProfile, setIsHandlingProfile] = useState(false);

  // * fetch logged in user data
  const { user } = useContext(UserContext);

  // * navigate to different pages
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleHome = () => {
    navigate("/");
  };
  const handleProfile = () => {
    if (!isHandlingProfile) {
      setIsHandlingProfile(true);
      navigate("/posts/user/" + userId);
    }
    setIsHandlingProfile(false);
  };

  // * fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user) {
      setProfilePic(user.user.profilePic);
      console.log(user.profilePic);
      setUserId(user.id);
      setLoggedIn(true);
    }
  }, [user]);

  // * handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    handleHome();
    setLoggedIn(false);
  };

  const titleFont = {
    fontFamily: "Roboto Condensed, Roboto, sans-serif",
  };

  return (
    <nav className="flex justify-between items-center px-4 sm:px-2 bg-slate-500 ">
      {/* Left side (Home icon and Profile) */}
      <ul className="flex space-x-6 sm:space-x-4 my-5">
        <li title="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-houses-fill cursor-pointer transition-transform duration-0 hover:scale-125 w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
            viewBox="0 0 16 16"
            onClick={handleHome}
          >
            <path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.5 2.5 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354z" />
            <path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708z" />
          </svg>
        </li>
        <li title="Profile">
          {loggedIn ? (
            profilePic ? (
              <img
                src={profilePic}
                alt="Profile Image"
                className=" rounded-full w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
                onClick={handleProfile}
              />
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-person-square cursor-pointer transition-transform duration-0 hover:scale-125 w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
                  viewBox="0 0 16 16"
                  onClick={handleProfile}
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                </svg>
              </span>
            )
          ) : (
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-person-square cursor-pointer transition-transform duration-0 hover:scale-125 w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
              </svg>
            </span>
          )}
        </li>
      </ul>

      {/* Center (Title) */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-3 md:space-x-4 lg:space-x-6 transition-transform duration-0 hover:scale-125 cursor-pointer">
        <h1
          className="text-4xl text-5xl lg:text-6xl font-bold text-black"
          style={titleFont}
          onClick={handleHome}
        >
          GET
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          fill="currentColor"
          className="bi bi-bezier2 text-black"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1 2.5A1.5 1.5 0 0 1 2.5 1h1A1.5 1.5 0 0 1 5 2.5h4.134a1 1 0 1 1 0 1h-2.01q.269.27.484.605C8.246 5.097 8.5 6.459 8.5 8c0 1.993.257 3.092.713 3.7.356.476.895.721 1.787.784A1.5 1.5 0 0 1 12.5 11h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5H6.866a1 1 0 1 1 0-1h1.711a3 3 0 0 1-.165-.2C7.743 11.407 7.5 10.007 7.5 8c0-1.46-.246-2.597-.733-3.355-.39-.605-.952-1-1.767-1.112A1.5 1.5 0 0 1 3.5 5h-1A1.5 1.5 0 0 1 1 3.5zM2.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10 10a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
          />
        </svg>
      </div>

      {/* Right side (People icon) */}
      <ul className="flex space-x-6 sm:space-x-4">
        <li title="Login">
          {loggedIn ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-box-arrow-right cursor-pointer transition-transform duration-0 hover:scale-125 w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
              viewBox="0 0 16 16"
              onClick={handleLogout}
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-people-fill cursor-pointer transition-transform duration-0 hover:scale-125 w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10"
              viewBox="0 0 16 16"
              onClick={handleLogin}
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
