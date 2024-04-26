import {useState,useEffect,useRef} from "react";
export default function  PrivateChat(props){
    const [msgs,useMsgs]=useState([]);
    const inputRef=useRef();
    const sizeRef=useRef();
    
    const handleMsg=()=>{
        const msg=inputRef.current.value;
        
        if(msg.length>0){
            props.send(props.partner,msg)
            inputRef.current.value="";
            
        }
    
      const msgsWrapper=  document.querySelector("#msgsWrapper");
      //msgsWrapper.scrollTop=msgsList.scrollHeight;
      msgsWrapper.scrollTo(0,msgsWrapper.scrollHeight);

    }
    const minMax=()=>{
        if (sizeRef.current.innerHTML=="min"){
        document.querySelector("#chatContainer").style.height="6vh";
        sizeRef.current.innerHTML="max";
        }
        else{
            document.querySelector("#chatContainer").style.height="30vh";
            sizeRef.current.innerHTML="min";
            }  
        }
    
    const chatContainerStyle={
        position:"absolute",
        zIndex:9,
        bottom:0,
        right:0,
        border:"2px solid red",
        width:"20vw",
        height:"30vh",
        display:"flex",flexDirection:"column",overflowY:"hidden"
        
    };
    const headStyle={display:"flex",alignItems:"center", 
    textOverflow:"clip",whiteSpace:"nowrap",height:"10vh"};
    const msgsStyle={
        
        
        maxHeight:"calc(100% - 7vh)",minHeight:"calc(100% - 7vh)",
        overflow:"auto"
    };
    const senderStyle={
        maxHeight:"30vh",minHeight:"30vh"
    };
    
    useEffect(()=>{
        const chatContainer=document.querySelector("#chatContainer");
        
        chatContainer.addEventListener("dragend",(e)=>{
            e.preventDefault();
            e.target.style.left=e.clientX+"px";
            e.target.style.top=e.clientY+"px";
        }
            );
        
    },[]);
    useEffect(()=>{
        
      const msgsWrapper=  document.querySelector("#msgsWrapper");
      //msgsWrapper.scrollTop=msgsList.scrollHeight;
      msgsWrapper.scrollTo(0,msgsWrapper.scrollHeight);
    },[props.chatState])
    
    return (
    
    <>  
    
        < div style={chatContainerStyle} draggable={true} id="chatContainer">
        
        <div style={headStyle}>
           
           <button onClick={minMax} ref={sizeRef}>min</button> 
           <button style={{color:"red"}} onClick={()=>props.remove(props.partner)}>
           X
           </button>
          <span> {props.partner} </span>
           
           </div>
                
            <div style={msgsStyle} id="msgsWrapper">
                <ul>
                    {props.chatState.map((msg,i)=><li key={i}>
                    <div>{msg.user}</div>
                    {msg.msg}</li>)}
                    <li style={{listStyleType:"none"}}> &nbsp;</li>
                </ul>
              
            </div>
            <div style={senderStyle}>
                <input type="text" ref={inputRef}></input>
                <button onClick={handleMsg}>send</button>
            </div>
        </div>
        </>
        
    )
}