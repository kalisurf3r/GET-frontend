import { useState } from "react";
import { useEffect } from "react";

const YTPreview = ({ content }) => {
  const [oEmbedData, setOEmbedData] = useState(null);
  const [error, setError] = useState(null);

  // * Helper function to fetch oEmbed data
  const fetchOEmbed = async (url) => {
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`;

      const response = await fetch(oEmbedUrl);

      if (response.ok) {
        const data = await response.json();
        return data; 
      } else {
        console.error(
          `oEmbed failed. Status: ${response.status}, URL: ${oEmbedUrl}`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching oEmbed data:", error);
      return null;
    }
  };

   // * Process content and fetch previews
  useEffect(() => {
    const fetchPreviews = async () => {
      
      console.log("Content received in YTPreview:", content);
      
      if (!content || typeof content !== "string") {
        console.error("Invalid content provided:", content);
        setOEmbedData([]);
        setError("Invalid content.");
        return;
      }

      const sanitizedContent = content.trim();
      console.log("Sanitized Content:", sanitizedContent);

      const urlRegex =
      /(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+))/g;
      const matches = [...sanitizedContent.matchAll(urlRegex)];

      console.log("Regex matches:", matches);

      if (matches.length > 0) {
        const promises = matches.map((match) => {
          const url = match[0]; // * Full matched URL
          console.log("Valid YouTube URL detected:", url);
          return fetchOEmbed(url);
        });
        const results = await Promise.all(promises);
        console.log("Fetched oEmbed results:", results);

        const filteredResults = results.filter((result) => result !== null);
        setOEmbedData(filteredResults);
        setError(null);
      } else {
        console.warn("No YouTube URLs found in content");
        setOEmbedData([]);
        setError("No valid YouTube links found.");
      }
    };

    fetchPreviews();
  }, [content]);

  return (
    <div className="yt-preview">
      {error && <p className="text-red-500">{error}</p>}

      {oEmbedData && oEmbedData.length > 0
        ? oEmbedData.map((data, index) => (
            <div
              key={index}
              className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg text-gray-200 transition-transform transition-duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-10">{data.title}</h3>
              <img
                src={data.thumbnail_url}
                alt={data.title}
                className="w-full h-auto rounded-lg mb-4"
              />
              <a
                href={`https://www.youtube.com/watch?v=${data.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 underline text-lg"
              >
                Watch on YouTube
              </a>
            </div>
          ))
        : !error && (
            <p className="text-gray-400">No YouTube previews available.</p>
          )}
    </div>
  );
};

export default YTPreview;
