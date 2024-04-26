import {useState,useRef,useContext} from "react";
import { useNavigate } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import{validateEmail} from "./helpers/validators.jsx";
import NotSigninNav from "./NotSigninNav.jsx";
export default function SignIN(props){
    const [ signinState , useSiginState]=useState("login to your account");
    const [session,setSession]=useContext(sessionContext);
    // redirect if there's a user already
    const navigate=useNavigate();
    if (session.user){navigate("/",{replace:true});}
    const emailRef=useRef();
    const passwordRef=useRef();
    const handleSignin=async ()=>{
       const email=emailRef.current.value;
       const password=passwordRef.current.value;
       if(!validateEmail(email)){useSiginState("invalid email type a correct one");return ;}
    
       const { data, error } = await props.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if(error){

        
         useSiginState("sorry a wrong password or email or an error occured");
        }
      else{
          console.log(data.user.user_metadata);
          const user={id:data.user.id,
            fName:data.user.user_metadata.firstName,
            lName:data.user.user_metadata.lastName,
            uName:data.user.user_metadata.userName
            


        };
        setSession({...session,user:user});
        navigate("/",{replace:true});
      }
       
    }
    
    
    return (
        <>
        <NotSigninNav></NotSigninNav>
        <h1>{signinState}</h1>
        <div>
            <input type="email" placeholder="email" ref={emailRef}/>
        </div>
        <div>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <div>
                must containe lower and uper case characters and numbers
            </div>
        </div>
        <div>
            <button onClick={handleSignin}>sign in</button>
        </div>
        </>
    )
}