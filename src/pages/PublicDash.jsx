import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicPost from "../components/PublicPost";
import Filters from "../components/FilterPosts";
import BASE_URL from "../components/Config";

function PublicDash() {

  // * states for loading posts
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // * states to store all posts, selected topics and filtered posts
  const [allPosts, setAllPosts] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(allPosts);

  // * topics to filter posts
  
  const topics = [
    "React",
    "JavaScript",
    "Node",
    "CSS",
    "HTML",
    "Python",
    "Data Structures",
    "Algorithms",
    "TypeScript",
    "GraphQL",
    "Redux",
    "Vue",
    "Angular",
    "Next.js",
    "Express",
    "MongoDB",
    "SQL",
    "NoSQL",
    "Web Security",
    "Testing",
  ];

  // * function to handle topic change
  const handleTopicChange = (topic) => {
    const updatedTopics = selectedTopics.includes(topic) // Check if topic is already selected
      ? selectedTopics.filter((t) => t !== topic) // Remove topic if already selected
      : [...selectedTopics, topic]; // Add topic if not selected
    setSelectedTopics(updatedTopics);

    // * Filter posts based on updated topics
    const filtered =
      updatedTopics.length > 0 // if there are selected topics
        ? allPosts.filter(
            (
              post // apply filters to posts
            ) =>
              post.topics.some((postTopic) => updatedTopics.includes(postTopic))
          )
        : allPosts; // Show all posts if no topics are selected

    setFilteredPosts(filtered);
  };

  // * default image for user profile
  const defaultImg = "./avatar.png";

  // * fetch all posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/posts`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Fetched post data:", data);
        setAllPosts(data);
        setFilteredPosts(data); // Set filtered posts to all posts initially
        const sortPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
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

  // * handle like update
  const handleLikeUpdate = (id, newLikeCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, likes: newLikeCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };

  // * handle dislike update
  const handleDislikeUpdate = (id, newDislikeCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, dislikes: newDislikeCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };

  // * handle comment update
  const handleCommentUpdate = (id, newCommentCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, comments: newCommentCount } : post
      );
      // Sort posts by timestamp in descending order
      return updatedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };

  // * handle liked comment update
  const handleLikedCommentUpdate = (id, newLikedCommentCount) => {
    setPost((prevPosts) => {
      const updatedPosts = prevPosts.map((post) =>
        post.id === id ? { ...post, likedComments: newLikedCommentCount } : post
      );
      // Sort posts by most liked comments in descending order
      return updatedPosts.sort((a, b) => b.likedComments - a.likedComments);
    });
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
    <>
      <div className="min-h-screen flex flex-col items-center">
        <div className="bg-gray-900 text-gray-200">
          <div className="container mx-auto py-6">
            <Filters
              topics={topics}
              selectedTopics={selectedTopics}
              handleTopicChange={handleTopicChange}
            />
          </div>
        </div>
        {
          // Renders al posts or filtered posts based on selected topics
          filteredPosts.map((post) => (
            <PublicPost
              key={post.id}
              id={post.id}
              userId={post.User.id}
              userName={post.User.userName}
              title={post.title}
              content={post.content}
              imageUrl={
                post.User?.profilePic ? post.User.profilePic : defaultImg
              }
              likes={post.likes}
              dislikes={post.dislikes}
              createdAt={post.createdAt}
              finalComments={post.Comments.sort((a, b) => b.likes - a.likes)}
              topics={post.User.topics}
              topicsPosts={post.topics}
              likeUpdate={handleLikeUpdate}
              dislikeUpdate={handleDislikeUpdate}
              commentUpdate={handleCommentUpdate}
              likedCommentUpdate={handleLikedCommentUpdate}
              allPosts={allPosts}
            />
          ))
        }
      </div>
    </>
  );
}

export default PublicDash;
