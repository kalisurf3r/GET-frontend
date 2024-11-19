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
        <h1 className="text-4xl text-center cursor-default">Login</h1>
      </div>

      <div>
        <form
          className="flex flex-col items-center mt-10"
          onSubmit={handleSubmit}
        >
          <label htmlFor="username" className="text-xl mb-2">
            Username
          </label>
          <input
            type="username"
            id="username"
            name="username"
            className="border-2 border-black p-2 rounded-lg w-80 transition-transform duration-300 hover:scale-110  bg-zinc-300"
            placeholder="Username"
            autoComplete="username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="password" className="mt-4 text-xl mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="border-2 border-black p-2 rounded-lg w-80 transition-transform duration-300 hover:scale-110  bg-zinc-300"
            placeholder="Password"
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white text-xl py-2 px-4 rounded-full mt-8 transition-transform duration-300 hover:scale-125">
            Login
          </button>

          <h3 className="mt-6 text-xl flex">
            Not a Member?&nbsp;
            <span
              className="italic cursor-pointer font-semibold transition-transform duration-300 hover:scale-110" 
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
