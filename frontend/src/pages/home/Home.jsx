


import { useEffect, useState } from "react";
import Header from "../../components/header/Header"; // Assumed Header renders the photo
import Posts from "../../components/posts/Posts";
import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState(""); // State for the search input
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { search } = useLocation();
  const navigate = useNavigate();

  
 
  return (
    

      // <div className="home">
      //   <div className="headerTitles">
          
      //     <span className="headerTitleLg">FITASSIST</span>
          
          
      //     <Link className="linkk" to="/counter">
      //       COUNTER
      //     </Link> 
          
      //   </div>
      // </div>

      <div className="home">
        <div className="sec1">
          <div className="headerTitleLg">FITASSIST</div>
          <div className="counterbutton">
            <Link className="link" to="/counter">
              COUNTER
            </Link> 
          </div>
        </div>
      </div>

  );

  

}