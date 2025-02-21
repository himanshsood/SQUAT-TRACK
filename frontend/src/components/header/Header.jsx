import "./header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleLg">FITASSIST</span>
        <br></br>
        <Link className="linkk" to="/counter">
                        COUNTER
        </Link>
      </div>
      
    </div>
  );
}