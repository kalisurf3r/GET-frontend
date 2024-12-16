import { useState } from "react";
// * Component to select topics upon user registration
const TopicSelector = ({ setTopics }) => {
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
    setTopics(updatedTopics); // * update the parent component
  };

  return (
    <div className="flex flex-wrap gap-4 mt-6 justify-center">
      {topics.map((topic) => (
        <button
          type="button"
          key={topic}
          className={`px-6 py-3 font-semibold text-lg sm:text-xl md:text-2xl rounded-full shadow-lg transition-transform duration-300 ${
            selectedTopics.includes(topic)
              ? "bg-green-600 text-white hover:bg-green-500 hover:scale-110"
              : "bg-gray-300 text-gray-800 hover:bg-green-600 hover:scale-105"
          }`}
          onClick={() => handleTopicChange(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};
export default TopicSelector;
