import {useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
export default function SigninNav (props){
  const [session,setSession]=useContext(sessionContext);
  const handleSignout=async ()=>{
    localStorage.setItem("session",JSON.stringify({user:undefined}));
    props.supabaseClient.removeAllChannels();
    await props.supabaseClient.auth.signOut()
    setSession({user:undefined});


  }
  const style={position:"fixed",top:0};
  return (
  <nav style={style}>
      <Link to="/">Home</Link> &nbsp;
      <button onClick={handleSignout}>sign out</button>
  </nav>
  )
}