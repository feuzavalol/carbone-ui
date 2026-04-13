import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDeck from "../components/UserDeck"

function useUserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchUsers() {
      try {        
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
              //"Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        console.log(data);
        setUserList(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err);
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);
  
  return { userList, loading, error };
};

function Users() {
  const { userList, loading, error } = useUserList();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <UserDeck userList={userList} />
    </>
  );
}

export default Users
