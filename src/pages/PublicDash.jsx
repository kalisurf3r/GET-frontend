import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicPost from "../components/PublicPost";
import Comment from "../components/Comment";


function PublicDash() {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  const defaultImg = './avatar.png';

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:3004/posts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
       
        console.log("Fetched post data:", data);
        const sortPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPost(sortPosts);
      } catch (error) {
        setError(error);
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const handleLikeUpdate = (id, newLikeCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, likes: newLikeCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  };

  const handleDislikeUpdate = (id, newDislikeCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, dislikes: newDislikeCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  }

  const handleCommentUpdate = (id, newCommentCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, comments: newCommentCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  }

  const handleLikedCommentUpdate = (id, newLikedCommentCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, likedComments: newLikedCommentCount } : post
      );
      // Sort posts by most liked comments in descending order
      return updatedPosts.sort((a, b) => b.likedComments - a.likedComments);
    });
  }
 
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
    <div className="min-h-screen flex flex-col items-center">
      {post &&
        post.map((post) => (
          <PublicPost
            key={post.id}
            id={post.id}
            userId={post.User.id}
            userName={post.User.userName}
            title={post.title}
            content={post.content}
            imageUrl={
              post.User?.profilePic ? (
                post.User.profilePic
              ) : (
                defaultImg
              )
            }
            likes={post.likes}
            dislikes={post.dislikes}
            createdAt={post.createdAt}
            finalComments={post.Comments.sort((a, b) => b.likes - a.likes)}
            topics={post.User.topics}
            likeUpdate={handleLikeUpdate}
            dislikeUpdate={handleDislikeUpdate}
            commentUpdate={handleCommentUpdate}
            likedCommentUpdate={handleLikedCommentUpdate}
          />
         
        ))}
        
    </div>
  );
}

export default PublicDash;

