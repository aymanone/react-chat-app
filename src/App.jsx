import { useState,useEffect } from 'react'
import supabaseClient from "./supabaseClient.jsx";
import sessionContext from "/components/contexts/sessionContext.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignUp from "../components/SignUp.jsx";
import SignIn from "../components/SignIn.jsx";
import Home from "../components/Home.jsx";
import Room from "../components/Room.jsx";
import ErrorPage from "../components/ErrorPage.jsx";

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    {
      path: "/",
      element:<Home supabaseClient={supabaseClient} ></Home> ,
      errorElement:<ErrorPage />,
    },
    {
      path:"/signup",
      element:<SignUp supabaseClient={supabaseClient}></SignUp>,
      errorElement:<ErrorPage />,
    },

    {
      path:"/signin",
      element:<SignIn supabaseClient={supabaseClient}></SignIn>,
      errorElement:<ErrorPage />,
    },
    {
      path:"/rooms/:roomName",
      element:<Room supabaseClient={supabaseClient} />,
      errorElement:<ErrorPage />,
    }
  ]);
  const [session,setSession]=useState(()=>{
    const session=localStorage.getItem("session");
    if(session){return JSON.parse(session);}
    return {user:undefined};
});
useEffect(()=>{

setSession(JSON.parse(localStorage.getItem("session")));
},[])
useEffect(()=>{

localStorage.setItem("session",JSON.stringify(session));

})

  return (
    <sessionContext.Provider value={[session,setSession]}>
    <RouterProvider router={router}>
    </RouterProvider>
    </sessionContext.Provider>
    
  )
}

export default App
