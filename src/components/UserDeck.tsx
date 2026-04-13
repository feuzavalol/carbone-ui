import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Container({children}){
  return <div id="container" className='container'>{children}</div>
}

export default function UserDeck({userList }){
  let navigate = useNavigate(); 
  const routeChange = (user) =>{ 
    let path = `/users/${user.name}`; 
    navigate(path);
  }
  return (
    <Container>
      {userList.map((user) => (
        <div key={user.id} className="user" onClick={() => routeChange(user)}>{user.name}</div>
      ))}
    </Container>
  );
}
