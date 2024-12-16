import { set } from "@cloudinary/url-gen/actions/variable";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import Modal from "./Modal";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./animation.css";
import { Filter } from "bad-words";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

function PublicPost({
  id,
  userName,
  userId,
  title,
  content,
  imageUrl,
  topics,
  topicsPosts,
  likes,
  dislikes,
  createdAt,
  likeUpdate,
  dislikeUpdate,
  commentUpdate,
  likedCommentUpdate,
  finalComments,
}) {
  const imgStyle = {
    width: "75px",
    height: "75px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #f1f1f1",
  };

  const commentImgStyle = {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #f1f1f1",
  };

  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikedPosts, setDislikedPosts] = useState([]);

  // * check if post is liked
  useEffect(() => {
    // Retrieve liked posts from local storage
    const storedLikedPosts = localStorage.getItem("likedPosts");
    const parsedLikedPosts = storedLikedPosts
      ? JSON.parse(storedLikedPosts)
      : [];

    // Check if the current post is liked
    const liked = parsedLikedPosts.includes(id);
    setIsLiked(liked);
    setLikedPosts(parsedLikedPosts);
  }, [id]);

  // * check if post is disliked
  useEffect(() => {
    const storedDislikedPosts = localStorage.getItem("dislikedPosts");
    const parsedDislikedPosts = storedDislikedPosts
      ? JSON.parse(storedDislikedPosts)
      : [];

    const disliked = parsedDislikedPosts.includes(id);
    setIsDisliked(disliked);
    setDislikedPosts(parsedDislikedPosts);
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3004/posts/like/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // * Like Counter Logic
      setLikeCount(data.likes);
      likeUpdate(id, data.likes);
      // Update likedPosts array
      const newLikedPosts = [...likedPosts, id];
      setLikedPosts(newLikedPosts);
      // Store updated likedPosts in local storage
      localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
      // Update isLiked state immediately
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3004/posts/dislike/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // * Dislike Counter Logic
      setDislikeCount(data.dislikes);
      dislikeUpdate(id, data.dislikes);

      const newDislikedPosts = [...dislikedPosts, id];
      setDislikedPosts(newDislikedPosts);

      localStorage.setItem("dislikedPosts", JSON.stringify(newDislikedPosts));
      setIsDisliked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const [commentedPosts, setCommentedPosts] = useState([]);
  const [isCommented, setIsCommented] = useState([]);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [comTitle, setComTitle] = useState("");
  const [comContent, setComContent] = useState("");
  const [comDate, setComDate] = useState("");
  const [comPostId, setComPostId] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  // * filter for profanity
  const filter = new Filter();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // * sanitize comment & check for profanity
      const filteredComment = filter.clean(comContent);
      const sanitizedComment = DOMPurify.sanitize(filteredComment);

      const payload = {
        user_id: user.id,
        post_id: id,
        date: new Date().toISOString(),
        content: sanitizedComment,
      };

      const response = await fetch(`http://localhost:3004/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("response data:", data);
      const commentId = data.id;

      console.log("Comment ID:", commentId);

      // Update state
      setComments((prevComments) => [...prevComments, data.Comments]);
      setComPostId(commentId);

      // Ensure commentUpdate is called with the correct parameters
      commentUpdate(commentId, data.Comments);

      // Update commented posts
      setCommentedPosts((prevCommentedPosts) => [
        ...prevCommentedPosts,
        commentId,
      ]);
      localStorage.setItem("commentedPosts", JSON.stringify(setCommentedPosts));
      setIsCommented(true);
      setIsModalOpen(false);
      setComContent("");
      window.location.reload();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // * load all commnets for a post

  const [renderComments, setRenderComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const loadComments = async () => {
    try {
      const response = await fetch(`http://localhost:3004/comments/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched comment data:", data);
      setRenderComments(data);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching comment data:", error);
    }
  };

  const toggleComments = () => {
    if (!loaded) {
      loadComments();
    }
    setCommentsVisible(!commentsVisible);
  };

  // * check if comment is liked
  useEffect(() => {
    const storedLikedComments = localStorage.getItem("likedComments");
    const parsedLikedComments = storedLikedComments
      ? JSON.parse(storedLikedComments)
      : [];

    // const liked = parsedLikedComments.includes(id);
    // setIsComLiked(liked);
    setLikedComments(parsedLikedComments);
  }, []);

  // *  like logic for comments

  const [comLikes, setComLikes] = useState(
    finalComments.map((comment) => comment.likes)
  );
  const [isComLiked, setIsComLiked] = useState(false);
  const [likedComments, setLikedComments] = useState([]);

  const handleCommentLike = async (commentId, index) => {
    if (likedComments[commentId]) {
      console.log("Comment already liked");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3004/comments/like/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Network response was not ok:",
          response.status,
          errorText
        );
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Comment liked:", data);

      if (data.likes !== undefined) {
        const newComLikes = [...comLikes];
        newComLikes[index] = data.likes;
        setComLikes(newComLikes);

        likedCommentUpdate(commentId, data);

        setLikedComments((prevLikedComments) => {
          const updatedLikedComments = {
            ...prevLikedComments,
            [commentId]: true,
          };
          localStorage.setItem(
            "likedComments",
            JSON.stringify(updatedLikedComments)
          );
          return updatedLikedComments;
        });
      } else {
        console.error("Server response does not contain likes count:", data);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // * navigate to profile
  const navigate = useNavigate();

  const goProfile = () => {
    navigate(`/profile/${userId}`, {
      state: { id, userId, userName, imageUrl, topics },
    });
  };

  return (
    <div
      className={` flex flex-col lg:w-3/4 xl:w-2/3 shadow-lg border-4 border-gray-200 border-dotted border-gray-800 justify-center items-center mt-6 mx-auto w-full h-full overflow-hidden max-w-full  p-6`}
    >
      <div className="border-2 border-gray-200 flex items-center px-4 py-6 w-full">
        <div className="ppic mr-2 flex flex-col items-center sm:flex-row sm:items-center border-r-2 border-gray-200">
          <img
            src={imageUrl}
            alt="profile"
            className="mr-1 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full cursor-pointer"
            onClick={goProfile}
          />
          <h3 className="text-center mr-2 mt-4 text-lg md:text-xl lg:text-2xl font-semibold text-gray-200">
            {userName}
          </h3>
        </div>

        <div className="flex flex-col flex-grow pl-4">
          <div className="title border-b-2 border-gray-200  pb-2">
            <h1 className="text-lg text-gray-200 md:text-xl lg:text-2xl font-bold">
              {title}
            </h1>
            <h1 className="text-lg mt-4 md:text-xl lg:text-2xl font-bold text-gray-200 tracking-wide text-center"> Topics: {Array.isArray(topicsPosts) ? topicsPosts.join(", ") : "No topics"}</h1>
          </div>

          <div className="content  mt-4">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
              {content}
            </p>
          </div>

          <div className="votes relative mt-10 w-full flex items-center justify-between px-6">
            <div className="flex items-center">
              <span className="like  mr-2 text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {likes}
              </span>
              <button
                className={`like-button ${isLiked ? "disabled" : ""}`}
                disabled={isLiked}
                onClick={handleLike}
                title="Like"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isLiked ? "blue" : "currentColor"}
                  className="bi bi-hand-thumbs-up-fill text-gray-300 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 transition-transform duration-300 hover:scale-150"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center">
              <span className="dislike ml-2 mr-2 text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {dislikes}
              </span>
              <button
                className=" dislike-button ${isDisliked ? 'disabled' : ''}"
                disabled={isDisliked}
                onClick={handleDislike}
                title="Dislike"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isDisliked ? "red" : "currentColor"}
                  className="bi bi-hand-thumbs-down-fill text-gray-300 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 transition-transform duration-300 hover:scale-150"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
              <button
                onClick={toggleComments}
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 p-3 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition-transform duration-300 hover:scale-125"
                title="Show Comments"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-body-text w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded-lg shadow-lg font-semibold hover:bg-blue-600 hover:scale-110 transition-transform duration-300 text-sm sm:text-base lg:text-lg"
                onClick={handleModalOpen}
              >
                Leave a comment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="commentcontainer w-full flex justify-center items-center"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        {commentsVisible && (
          <div className="mt-2 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12 p-6 rounded-lg shadow-lg">
            <ul className="space-y-4">
              <TransitionGroup>
                {finalComments.slice(-5).map((comment, index) => (
                  <CSSTransition
                    key={comment.id}
                    timeout={500}
                    classNames="comment"
                  >
                    <li
                      key={comment.id}
                      className="comment-item flex items-start my-2 space-x-4 p-4 rounded-lg shadow-md border border-gray-200"
                    >
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="profile-pic rounded-full w-12 h-12 sm:w-16 sm:h-16"
                      />

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-200 text-lg md:text-xl lg:text-2xl">
                          {comment.User.userName}
                        </h4>
                        <p className="text-base text-gray-200 md:text-lg lg:text-xl text-gray-900 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      <div className="votes flex items-center space-x-2">
                        <span className="text-lg text-gray-200 md:text-xl lg:text-2xl text-gray-900">
                          {comLikes[index]}
                        </span>
                        <button
                          className={`like-button ${
                            likedComments[comment.id] ? "liked" : ""
                          } ml-1 flex items-center`}
                          onClick={() => handleCommentLike(comment.id, index)}
                          disabled={likedComments[comment.id]}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              likedComments[comment.id] ? "red" : "currentColor"
                            }
                            className="bi bi-heart-fill text-gray-200 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 transition-transform duration-300 hover:scale-125"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ul>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={handleModalClose}
              className="absolute top-2 left-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-x-lg text-gray-200 hover:fill-red-500"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>

            <textarea
              placeholder="Write your comment here..."
              className="w-full h-32 mt-4 p-4 text-lg text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
              value={comContent}
              onChange={(e) => setComContent(e.target.value)}
            ></textarea>

            <button
              className="bg-blue-500 text-gray-200 py-3 px-6 rounded-full mt-4 mx-auto block text-lg font-semibold shadow-md hover:bg-blue-600 hover:scale-110 hover:shadow-lg transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleComment}
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicPost;
