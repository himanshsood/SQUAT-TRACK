
import "./single.css";
import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlepost/SinglePost";
import axios from "axios";

export default function Single({post}) {

  return (
    <div className="single">
      <SinglePost/>
      {/* <Sidebar /> */}

      
    </div>
  );
}
