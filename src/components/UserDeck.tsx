import type { User } from "../types/authTypes";
import { useRouteChange } from "./helper/onRouteChange";

function Container({ children } : {children: any}){
  return <div id="container" className='container'>{children}</div>
}

export default function UserDeck({ userList }: { userList: User[]}){
  const { goTo } = useRouteChange();
  
  return (
    <Container>
      {userList.map((user, index) => (
        <div key={index} className="user" onClick={() => goTo(`/users/${user.name}`)}>
          {user.name}
        </div>
      ))}
    </Container>
  );
}
