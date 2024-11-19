import { useEffect, useRef } from 'react';

export default function UploadWidget({ onUpload }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const buttonStyle = {
    color: 'blue',
    border: 'none',
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dpaiwgit7',
        uploadPreset: 'unsigned',
        styles: {
          palette: {
            window: 'white',
          },
        },
      },
      function (error, result) {
        if (!error && result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info);
          // Pass the secure URL back to the parent component
          onUpload(result.info.secure_url);
        }
      }
    );
  }, [onUpload]);

  return (
    <>
      <button
        className="mt-4 text-lg"
        type="button"
        style={buttonStyle}
        onClick={() => widgetRef.current.open()}
      >
        Profile Picture
      </button>
    </>
  );
}
