import { useState } from "react";
// * Component to select topics for posts
const TopicPosts = ({ setTopics }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);

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
    let updatedTopics;
    if (selectedTopics.includes(topic)) {
      updatedTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      updatedTopics = [...selectedTopics, topic];
    }

    setSelectedTopics(updatedTopics);
    console.log("Updated topics:", updatedTopics);
    setTopics(updatedTopics); // * update the parent component
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-200 transition-colors duration-300 hover:text-green-500">
        Select Topics
      </h1>
      <div className="bg-gray-900 p-4 rounded-md shadow-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <label
            key={topic}
            className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md text-gray-100 cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <input
              type="checkbox"
              value={topic}
              checked={selectedTopics.includes(topic)}
              onChange={() => handleTopicChange(topic)}
              className="form-checkbox h-5 w-5 text-green-500"
            />
            <span>{topic}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TopicPosts;
