import React, { useState, useEffect } from "react";

const LinkPreview = ({ url, endpoint = "http://localhost:3004/posts/proxy/preview", className = "" }) => {
  const [linkPreview, setLinkPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setError("No URL provided.");
      return;
    }

    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching preview for URL:", url);
        const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch preview. Status: ${response.status}`);
        }

        const preview = await response.json();
        setLinkPreview(preview);
        setError(null);
        console.log("Preview data:", preview);
      } catch (err) {
        console.error("Error fetching link preview:", err);
        setLinkPreview(null);
        setError("Failed to fetch preview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [url, endpoint]);

  if (isLoading) {
    return <p className="text-gray-400">Loading preview...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!linkPreview) {
    return null; // Don't render anything if there's no preview or error
  }

  return (
    <div className={`link-preview ${className} mt-4 p-2 bg-gray-800 rounded-lg shadow-lg`}>
      <h3 className="text-base font-semibold mb-1 text-gray-100">{linkPreview.title}</h3>
      {linkPreview.images && linkPreview.images.length > 0 && (
        <img
          src={linkPreview.images[0]}
          alt={linkPreview.title}
          className="w-3/4 h-auto rounded-md mb-2 mx-auto"
        />
      )}
      <a
        href={linkPreview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500 underline text-lg"
      >
        Visit Site
      </a>
      <p className="text-gray-400 text-lg mt-2">{linkPreview.description}</p>
    </div>
  );
};

export default LinkPreview;