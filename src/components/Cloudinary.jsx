import { useEffect, useRef } from "react";

export default function UploadWidget({ onUpload }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const buttonStyle = {
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dpaiwgit7",
        uploadPreset: "unsigned",
        styles: {
          palette: {
            window: "white",
          },
        },
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // Pass the secure URL back to the parent component
          onUpload(result.info.secure_url);
        }
      }
    );
  }, [onUpload]);

  return (
    <div className="flex flex-col items-center mt-6">
      <button
        className="text-lg hover:scale-105"
        type="button"
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, buttonHoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, buttonStyle);
        }}
        onClick={() => widgetRef.current.open()}
      >
        Upload Profile Picture
      </button>
    </div>
  );
}
