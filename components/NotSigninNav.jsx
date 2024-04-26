import { Link } from "react-router-dom";
export default function NotSigninNav (props){
  return (
  <nav>
      <Link to="/">Home</Link> &nbsp;
      <Link to="/signin">signin</Link> &nbsp;
      <Link to="/signup">signup</Link>
  </nav>
  )
}