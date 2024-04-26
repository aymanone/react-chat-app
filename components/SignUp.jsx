import {useState,useRef,useContext} from "react";
import { useNavigate } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import{validateEmail,validatePassword} from "./helpers/validators.jsx";
import NotSigninNav from "./NotSigninNav.jsx";
import SigninNav from "./SigninNav.jsx";
export default function SignUp(props){
    const [ signupState , useSignupState]=useState("signup for a new account");
   // const [session,setSession]=useContext(sessionContext);
   const session=JSON.parse(localStorage.getItem("session"));
    // redirect if there's a user already
    const navigate=useNavigate();
    if (session.user){navigate("/",{replace:true});}
    const fNameRef=useRef();
    const lNameRef=useRef();
    const uNameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();
   
      const validateNames=(name)=>{
        if(name.length<2){return false;}
        const lowerCaseLetters = /[a-z]/g;
        return name.toLowerCase().match(lowerCaseLetters);
      }
      
    const handleSignup=async ()=>{
         const fName=fNameRef.current.value;
         if (! validateNames(fName)){useSignupState("invalid first name");return ;}
         const lName=lNameRef.current.value;
         if (! validateNames(lName)){useSignupState("invalid last name");return ;}
         const uName=uNameRef.current.value;
         if (! validateNames(uName)){useSignupState("invalid user name");return ;}
         const email=emailRef.current.value;
         if (! validateEmail(email)){useSignupState("invalid email");return ;}
         const password=passwordRef.current.value;
         if (! validatePassword(password)){useSignupState("invalid password");return ;}
         const { data, error } = await props.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options:{
                data:{
                firstName:fName,
                lastName:lName,
                userName:uName
            },
            },
          });
          if(error){
              if(error.toString().includes("duplicate key value")){
                  useSignupState("the email or username already exists");
                  return;
              }
               console.log(error.toString());
              
              useSignupState("an error occured please try again");
            }
          else{useSignupState("the signup is done login please");}
    }
    return (
        <>
        <NotSigninNav></NotSigninNav>
        <h1>{signupState}</h1>
        <div>
            <input type="text" placeholder="first name" ref={fNameRef}/>
            <div>a name at least 2 characters</div>
        </div>
        <div>
            <input type="text" placeholder="last name" ref={lNameRef}/>
            <div>a name at least 2 characters</div>
        </div>
        <div>
            <input type="text" placeholder="user name" ref={uNameRef}/>
            <div>unique for each user</div>
        </div>
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
            <button onClick={handleSignup}>signup</button>
        </div>
        </>
    )
}