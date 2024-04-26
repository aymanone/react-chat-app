const validateEmail=(email)=>{
        
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePassword=(password)=>{
    if ((password.length < 8 ) || (password.length>12)){
        return false;
      }
      if( !/[a-z]/.test(password)){return false;}
      if(!/[A-Z]/.test(password) ){return false;}
      if(!/\d/.test(password)){return false}
      return true;
}
export {validateEmail,validatePassword};