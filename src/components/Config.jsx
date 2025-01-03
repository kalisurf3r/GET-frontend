
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://get-backend.onrender.com"
    : "http://localhost:3004";
export default BASE_URL;