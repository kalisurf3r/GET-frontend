import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';

function MyPostsSingle() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3004/posts/${id}`);
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched post data:', data);
                setPost(data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        };
    
        fetchPost();
        }, [id]);

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
            <div className='flex flex-col justify-center items-center'>
            <div className='w-1/2 border-2 border-black border-dotted p-2'>
              <h1 className='border-2 border-black p-2'>{post.title}</h1>
              <p className='text-center'>{post.content}</p>
            </div>
          </div>
          );
}

export default MyPostsSingle;