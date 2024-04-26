import {useState,useRef,useContext, useEffect} from "react";
import sessionContext from "/components/contexts/sessionContext.jsx";
import NotSigninNav from "./NotSigninNav.jsx";
import SigninNav from "./SigninNav.jsx";
import {Link} from "react-router-dom";
export default function Home(props){
    const [session,setSession]=useContext(sessionContext);
    const [homeState,useHomeState]=useState({msg:"wait for loading",channels:undefined});
    const [newCahnnel,useNewChannel]=useState("add new channels");
    const channelName=useRef("");
    const channelDescription=useRef("");
   const s=async()=> {
       const { data, error } = await props.supabaseClient.auth.getUser();
       console.log(data);
    }
    const getChannels=async()=>{
        const {data,error}=await props.supabaseClient.from("rooms").select()
        .order("created_at",{ ascending: false },);
        if (!error){
            useHomeState({msg:"our channels",channels:data});
        }
        else{
            useHomeState({...homeState,msg:"sorry an error has occured"});
        }

    };
    
    const createChannel=async()=>{
        console.log("create new channel");
        const name=channelName.current.value;
        if(name.length==0){

            useNewChannel("sorry we must have name");
            return;
        }
        const description=channelDescription.current.value;
        const {data,error}=await props.supabaseClient.from("rooms").insert({name:name,description:description});
        if (!error){
            channelName.current.value="";
            channelDescription.current.value="";
            useNewChannel("the channel has been added");
        }
        else{
            //code for duplicated value=23505
            if (error.code=='23505'){
                useNewChannel("sorry a channel exists with this  name");
            }
            else{
                useNewChannel("sorry unknown error try again");
            }
        }

    };
    useEffect(()=>{
      getChannels();
    },[]);
    return (
        <>
        {session.user?
        <SigninNav supabaseClient={props.supabaseClient} ></SigninNav>:
        <NotSigninNav></NotSigninNav>
        }
        <h1>Home</h1>
       <h2> {session.user?homeState.msg:'login or signup'}</h2>
       {session.user?
       <div>
        <div>{newCahnnel}</div>
       <div><input type="text" placeholder="name of the channel" ref={channelName}>
       </input></div>
      <div> <input type="text" placeholder="description of it" ref={channelDescription}>
      </input></div>
       <div><button onClick={createChannel}>add</button></div>
       
       </div>
       
       :""
    
       }
       {session.user && homeState.channels?
       <ul>
        {homeState.channels.map((channel,i)=><li key={channel.id}><Link to={`rooms/${channel.name}`}>
        channel : {channel.name}
        </Link></li>)}

       </ul>
       :""
       }
        </>
    
    )
 

}