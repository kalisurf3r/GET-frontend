import UploadWidget from "../components/Cloudinary";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Filter} from "bad-words";
import DOMPurify from "dompurify";

function Register() {

  const filter = new Filter();

  const [profilePic, setProfilePic] = useState(null);
  const handleImageUpload = (url) => {
    setProfilePic(url);
  };

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // * sanitize username
    const sanitizedUserName = DOMPurify.sanitize(userName);

    // * check if username has profanity
    if (filter.isProfane(sanitizedUserName)) {
      alert("Username contains inappropriate language. Please choose another one.");
      return;
    }

    // * Check if username already exists
    const users = await getAllUsers();
    const userExists = users.some((user) => user.userName === userName);

    if (userExists) {
      alert("Username already taken. Please choose another one.");
      return;
    }

    // * password must be at least 8 characters long and contain at least one letter and one number
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3004/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password, profilePic }),
      });
      const data = await response.json();
      const token = data.token;
      console.log(data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3004/users");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // * password tracking
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setHasMinLength(newPassword.length >= 8);
    setHasLetter(/[A-Za-z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="pt-8">
          <h1 className="text-4xl text-center cursor-default">Register </h1>
        </div>

        <div>
          <form
            className="flex flex-col items-center mt-10"
            onSubmit={handleSubmit}
          >
            <label htmlFor="newusername" className="text-xl mb-2">
              Username
            </label>
            <input
              type="username"
              id="newusername"
              name="username"
              value={userName}
              className="border-2 border-black p-2 rounded-lg w-80 transition-transform duration-300 hover:scale-110  bg-zinc-300"
              placeholder="New Username"
              autoComplete="new-username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <label htmlFor="password" className="mt-4 text-xl mb-2">
              Password
            </label>
            <input
              type="password"
              id="newpassword"
              name="password"
              value={password}
              className="border-2 border-black p-2 rounded-lg w-80 transition-transform duration-300 hover:scale-110  bg-zinc-300"
              placeholder="New Password"
              autoComplete="new-password"
              onChange={handlePasswordChange}
            />
            <div className="mt-6 flex flex-col items-start">
              <div
                className={`flex items-center ${
                  hasMinLength ? "text-green-500" : "text-red-600"
                }`}
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  </svg>
                </span>
                <span>At least 8 characters</span>
              </div>
              <div
                className={`flex items-center ${
                  hasLetter ? "text-green-500" : "text-red-600"
                }`}
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  </svg>
                </span>
                <span>Contains a letter</span>
              </div>
              <div
                className={`flex items-center ${
                  hasNumber ? "text-green-500" : "text-red-600"
                }`}
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  </svg>
                </span>
                <span>Contains a number</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <UploadWidget onUpload={handleImageUpload} />
              {profilePic ? (
                <img
                  id="profileImgContainer"
                  src={profilePic}
                  alt="Profile Image Preview"
                  className="w-20 h-20 mt-4 rounded-full border-2 border-black"
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
            <button className="bg-blue-500 flex text-white text-xl py-2 px-6 rounded-full mt-8 transition-transform duration-300 hover:scale-125">
              Register
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-person-workspace ml-2 mt-1"
                viewBox="0 0 16 16"
              >
                <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
