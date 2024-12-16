import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MyPostsSingle() {
  // * Get post id from URL
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // * Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3004/posts/${id}`);
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
  }, [id]);

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
    <div className="relative min-h-screen">
      <div className="absolute top-0 w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-4xl lg:w-3/4 xl:w-2/3 mx-auto shadow-lg border-4 border-gray-200 border-dotted hover:border-green-500 transition-colors duration-300 p-4 mb-6 mt-10 lg:scale-110 lg:p-8 px-4 sm:px-6 md:px-8 mx-4 sm:mx-6">
          <div className="border-2 border-gray-300 p-2 flex flex-col  sm:items-center md:p-4 lg:p-6 xl:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-200 tracking-wide text-center">
              {post.title}
            </h1>
            <h2 className=" text-xl mt-4 md:text-2xl lg:text-3xl font-bold text-gray-200 tracking-wide text-center">
              Topics: {post.topics.join(", ")}
            </h2>
            <div className="votes flex ml-auto">
              <h3
                className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-200 mr-1 transition-transform duration-300 ease-in-out hover:scale-110"
                aria-label={`Post likes: ${post.likes}`}
                title={`${post.likes} likes`}
              >
                {post.likes}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="currentColor"
                className="bi bi-hand-thumbs-up-fill w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 fill-current text-gray-200 hover:text-green-500 transition-transform duration-300 hover:scale-125"
                viewBox="0 0 16 16"
              >
                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
              </svg>
              <h3 className="dislikes mr-1 text-lg md:text-xl lg:text-2xl font-semibold text-gray-200 mr-1 transition-transform duration-300 ease-in-out hover:scale-110">
                {post.dislikes}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="currentColor"
                className="bi bi-hand-thumbs-down-fill w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 fill-current text-gray-200 hover:text-red-500 transition-transform duration-300 hover:scale-125"
                viewBox="0 0 16 16"
              >
                <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591" />
              </svg>
            </div>
          </div>

          <p className="text-center text-lg md:text-xl lg:text-2xl text-gray-300 mt-4 leading-relaxed tracking-wide px-4 lg:px-8 transition-transform duration-300 hover:scale-105">
            {post.content}
          </p>
          <ul>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyPostsSingle;
