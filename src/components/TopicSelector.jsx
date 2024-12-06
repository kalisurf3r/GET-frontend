import { useState } from "react";

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
  ];

  const handleTopicChange = (topic) => {
    let updatedTopics;
    if (selectedTopics.includes(topic)) {
      updatedTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      updatedTopics = [...selectedTopics, topic];
    }
    setSelectedTopics(updatedTopics);
    setTopics(updatedTopics); // Notify the parent component
  };

  return (
    <div className="flex flex-wrap mt-4">
      {topics.map((topic) => (
        <button
        type="button"
          key={topic}
          className={`p-2 m-1 border rounded ${
            selectedTopics.includes(topic) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTopicChange(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
export default TopicSelector;
