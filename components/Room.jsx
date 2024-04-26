import {useState,useContext,useEffect,useRef} from "react";
import {useParams,useNavigate} from "react-router-dom";
import sessionContext from "/components/contexts/sessionContext.jsx";
import SigninNav from "./SigninNav.jsx";
import NotSignNav from "./NotSigninNav.jsx";
import PrivateChat from "./PrivateChat.jsx";



export default function Room(props){
    
    const [session,setSession]=useContext(sessionContext);
    const navigate=useNavigate();
    if(!session.user){navigate("/",{replace:true});}
    const {roomName}=useParams();
    
    let publicChannel=useRef(undefined);
    const [roomState,useRoomState]=useState({msg:"please wait",room:undefined});
    const [chatState,useChatState]=useState([]);
    const chatInputRef=useRef();
    const msgsRef=useRef();
    const [privateChats,usePrivateChats]=useState({});
    const chatStyle={display:"flex",flexDirection:"column",overflowY:"hidden"}
    const msgsContainerStyle={overflow:"auto","border":"2px solid red",
    maxHeight:"calc(100% - 75px)",minHeight:"calc(100% - 75px)"};
    const  msgSenderStyle={minHeight:"75px",maxHeight:"75px"};
    const chatWrapper={height:"85vh"};
    const getRoom=async()=>{
        const {data,error}= await props.supabaseClient.from("rooms").select().eq('name',roomName);
        if(!error && data.length>0){
            useRoomState({msg:roomName,room:data[0]});
        }
        else {
            console.log(error);
            useRoomState({...roomState,msg:"sorry an error occured or the room doesn't exist"});
        }
    }
    const receiveMsg=(payload)=>{
         const{msg,user}=payload.payload;
         useChatState((state)=>[...state,{msg:msg,user:user}]);
         let msgs=document.querySelector("#msgs");
         msgs.lastChild.scrollIntoView(false);
         
         

    }
    const safeMsg=(msg)=>{
      return msg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
    }
    const sendMsg=(e)=>{
      
      if( chatInputRef.current.value.length>0){
        const msg=safeMsg(chatInputRef.current.value);
        if(publicChannel.current){
          
          publicChannel.current.send({
            type: 'broadcast',
            event: `${roomName}Public`,
            payload: { msg:msg,user:session.user.uName },
          }
          );
        }
        chatInputRef.current.value="";
      }
    }
    const removePrivatePartner=(partner)=>{
       usePrivateChats((state)=>{
         
         delete state[partner];
         return {...state};
       });
    }
    const sendPrivate=(receiver,msg)=>{
      if(publicChannel.current){
        
        publicChannel.current.send({
          type: 'broadcast',
          event: `Private`,
          payload: { msg:msg,sender:session.user.uName,receiver:receiver },
        }
        );
      }
    }
    const addPrivateMsg=(sender,msg,partner)=>{
      
      if(privateChats[partner]){
        console.log("old partner");
        usePrivateChats((state)=>{
          
         return {...state,[partner]:[...state[partner],{user:sender,msg:msg}]}
        }
          );
        
      }
      else{
        
        console.log("new partner");
        usePrivateChats((state)=>{
          
         return  {...state,[partner]:[{user:sender,msg:msg}]}
        }
          );
       
      
    
      
    }
  }
    const receivePrivate=(payload)=>{
      const {sender,receiver,msg}=payload.payload;
    
      if(sender ==session.user.uName){
        addPrivateMsg(sender,msg,receiver);
        
      }
      else if(receiver==session.user.uName){
        addPrivateMsg(sender,msg,sender);

      }
    
    }
    useEffect(()=>{
        getRoom();
    },[]);
    useEffect(()=>{
      
        
        if(roomState.room){
          //init public channel
         publicChannel.current = props.supabaseClient.channel(`${roomName}`,{
            config: {
              broadcast: { self: true },
            },
          });
          publicChannel.current.subscribe(async(status) => {
            // Wait for successful connection
            if (status !== 'SUBSCRIBED') {
              return null;}
              const presenceTrackStatus = await publicChannel.current.track({userName:session.user.uName});
              console.log(presenceTrackStatus)
            });

publicChannel.current
  .on('presence', { event: 'sync' }, () => {
    const newState = publicChannel.current.presenceState()
    console.log('sync', newState)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      const newUser=newPresences[0].userName;
    useChatState((state)=>[...state,{user:"",msg:`${newUser} joined the  room`}]);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    const leavingUser=leftPresences[0].userName;
    useChatState((state)=>[...state,{user:"",msg:`${leavingUser} left the room`}]);
  });
  publicChannel.current.on('broadcast',
  { event: `${roomName}Public` },
  (payload) => receiveMsg(payload));

  publicChannel.current.on('broadcast',
  { event: `Private` },
  (payload) => receivePrivate(payload));



            
        }


    },[roomState.room]);
    return (
        <>
        
        {roomState.room &&session.user?
       
        Object.keys(privateChats).map((chat)=>{
         return <PrivateChat partner={chat} key={chat} send={sendPrivate}
          chatState={privateChats[chat]} remove={removePrivatePartner}>

         </PrivateChat>
        })
        
        :""

        }
        
         
        {session.user?
        <SigninNav supabaseClient={props.supabaseClient} ></SigninNav>
        :<NotSignNav></NotSignNav>}
        <h1>{session.user?roomState.msg:'login or sign up'}</h1>
        {roomState.room &&session.user?
        <div style={chatWrapper}>
        <div style={msgsContainerStyle}>
        <ul id="msgs"  ref={msgsRef} >
        {chatState.map((item,i)=><li key={i}><div>{item.user}</div>
        <div>{item.msg}</div>
        { item.user && item.user != session.user.uName?
        <button onClick={()=>sendPrivate(item.user,`hi ${item.user}`)}>private</button>
        :""}
        </li>)}
        </ul>
       
         </div>
         <div style={msgSenderStyle} >
        <input type="text" ref={chatInputRef}>
        </input>
        <button onClick={sendMsg}>send</button>
        </div>
         </div>
        :""
        }
       
        </>

    )

}