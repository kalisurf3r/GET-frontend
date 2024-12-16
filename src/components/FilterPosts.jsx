import { Querier } from "array-querier/lib/orbiter";

// * this component is responsible for rendering the filters section
// * this component lays over PublicPost.jsx

const Filters = ({ topics, selectedTopics, handleTopicChange }) => {
  return (
    <div className="filters-container px-4 py-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Filters Label */}
      <div className="mb-4">
        <label
          htmlFor="topic-filters"
          className="text-2xl font-semibold text-gray-100 tracking-wide"
        >
          Select Topics to Filter Posts:
        </label>
      </div>

      {/* Topics Selection */}
      <div
        id="topic-filters"
        className="flex flex-wrap gap-4 justify-center items-center"
      >
        {topics.map((topic) => (
          <button
            key={topic}
            className={`px-6 py-3 rounded-full font-semibold text-lg sm:text-xl transition-all duration-300 shadow-md 
                ${
                  selectedTopics.includes(topic)
                    ? "bg-green-600 text-white hover:bg-green-500 hover:scale-105"
                    : "bg-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:scale-105"
                }`}
            onClick={() => handleTopicChange(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
