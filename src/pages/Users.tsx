import { useState } from "react";
import UserDeck from "../components/UserDeck"
import { useUserList } from "../fetching/useUsers";


function Users() {
  const { userList, loading, error } = useUserList();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("");
  const [nameCommittee,setNameCommittee] = useState("");
  const [numberCommittee,setNumberCommittee] = useState(0);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // const register = async () => {
  //   const payload = { username, email, password, role, committeeCategory: nameCommittee, committeeNumber: numberCommittee };
  //   console.log("Payload envoyé:", JSON.stringify(payload)); 
  
  //   try {
  //     const res = await fetch(`${API_URL}/auth/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload)
  //     });

  //   if (!res.ok) {
  //     console.log(res);
  //     console.error("Erreur serveur:", res.status);
  //     return;
  //   }

  //   const data = await res.json(); 
  //   console.log(data);

  //   localStorage.setItem('my_app_token', data.token);
  //   setToken(data.token);
      

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const register = () => {} // TODO: Add the register action to allow admin to add new users (BRE and LIS)

  return (
    <>
    <div className="user-form">
      <h2>Rajouter un utilisateur</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="">Role</option>
          <option value="BRE">Respo carbone</option>
          <option value="LIS">Listeux</option>
          <option value="VIS">Visiteur</option>
        </select>
        <select
          value={nameCommittee}
          onChange={(e) => setNameCommittee(e.target.value)}>
          <option value="">Nom du bureau</option>
          <option value="BDS">BDS</option>
          <option value="BDE">BDE</option>
          <option value="BDA">BDA</option>
          <option value="BRE">BRE</option>
        </select>
        <select
          value={numberCommittee}
          onChange={(e) => setNumberCommittee(parseInt(e.target.value))}>
          <option value="">Numéro du bureau</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={register}>Sign in</button>
      </div>
    </div>
      <UserDeck userList={userList} />
    </>
  );
}

export default Users
