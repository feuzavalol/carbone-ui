import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css"
import { useEffect } from "react";

function Dashboard() {
  const { token } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
      if (token == null){
        
        navigate("/login")
      }
    }, [token]);

  
  return (
    <>
      <div className="dashboard">
        <nav className="navbar">
          <h1>Outil carbone des Mines</h1>
          <ul>
            <li><NavLink to="/home">Accueil</NavLink></li>
            <li><NavLink to="/login">Se connecter</NavLink></li>
            {/* <li><NavLink to="/users">Utilisateurs</NavLink></li> */}
            <li><NavLink to="/listeByYear">Listes</NavLink></li>
          </ul>
        </nav>
        
        <main className="content">
          <Outlet /> {/* Les pages s'affichent ici */}
        </main>
      </div>
      <footer>
        <p>
          Cet outil n'a pas de vocation à être utilisé dans un contexte professionel ou sérieux. <br />
          Il est a utilisé avec du recul et un minimum de connaissance sur le sujet.
        </p>
      </footer>
    </>
  );
}

export default Dashboard;
