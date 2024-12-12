import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";



function Login(props) {
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleRegister = () => {
    
    navigate("/register");
    window.location.reload();
  };

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3004/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      const token = data.token;
      console.log(data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", token);
        setUser(data.user);
       navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pt-8">
        <h1 className="text-5xl sm:text-6xl text-center text-gray-200 font-extrabold  tracking-wide cursor-default drop-shadow-md transition-colors duration-300 hover:text-green-500 ">Login</h1>
      </div>

      <div>
        <form
          className="flex flex-col items-center mt-10"
          onSubmit={handleSubmit}
        >
          <label htmlFor="username" className="text-xl sm:text-2xl mb-2 font-semibold text-gray-200">
            Username
          </label>
          <input
            type="username"
            id="username"
            name="username"
            className="border-2 border-black p-3 rounded-lg w-80 sm:w-96 transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-200 placeholder-gray-500 text-lg sm:text-xl"
            placeholder="Username"
            autoComplete="username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="password" className="mt-4 text-xl sm:text-2xl mb-2 font-semibold text-gray-200">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="border-2 border-black p-3 rounded-lg w-80 sm:w-96 transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-200 placeholder-gray-500 text-lg sm:text-xl"
            placeholder="Password"
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white text-xl sm:text-2xl md:text-3xl py-3 px-6 sm:py-4 sm:px-8 rounded-full mt-8 transition-transform duration-300 hover:scale-125 hover:bg-blue-600">
            Login
          </button>

          <h3 className="mt-6 text-lg sm:text-xl md:text-2xl flex justify-center items-center text-gray-200">
            Not a Member?&nbsp;
            <span
              className="italic text-green-500 cursor-pointer font-semibold transition-transform duration-300 hover:scale-110 hover:text-green-400 focus:ring-2 focus:ring-blue-500 rounded" 
              onClick={handleRegister}
            >
               Click Here
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
}

export default Login;
