import { useState } from "react";

const TopicSelector = () => {
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

  const handleTopicClick = (topic) => {
    setSelectedTopics(
      (prev) =>
        prev.includes(topic)
          ? prev.filter((t) => t !== topic) // Remove topic if already selected
          : [...prev, topic] // Add topic if not selected
    );
  };

  return (
    <div className="mt-8">
      <h3 className="mb-6 text-center text-2xl">Select Topics Around You</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {topics.map((topic) => (
          <button
            type="button"
            key={topic}
            onClick={() => handleTopicClick(topic)}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: selectedTopics.includes(topic)
                ? "#4caf50"
                : "#f0f0f0",
              color: selectedTopics.includes(topic) ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
