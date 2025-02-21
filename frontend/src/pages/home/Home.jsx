


import { useEffect, useState } from "react";
import Header from "../../components/header/Header"; // Assumed Header renders the photo
import Posts from "../../components/posts/Posts";
import "./home.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState(""); // State for the search input
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const res = await axios.get("/posts" + search);
        setPosts(res.data);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search]);

 
  return (
    <div className="home">
      {/* <h1 className="homeTitle">My Blog</h1> */}
      <Header />
     
      
    </div>
  );
}