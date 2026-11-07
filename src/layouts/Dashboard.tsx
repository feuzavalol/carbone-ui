import { NavLink, Outlet } from "react-router-dom";
import { isAdmin, isConnected } from "../auth/AuthContext";
import "./Dashboard.css"

function Dashboard() {
  const mainDashboard = 
    <>
      <li><NavLink to="/home">Accueil</NavLink></li>
      <li><NavLink to="/listeByYear">Listes/Assos</NavLink></li>
      <li><NavLink to="/db">Database</NavLink></li>
    </>;
  return (
    <>
      <div className="dashboard">
        <nav className="navbar">
          <h1>Outil carbone des Mines</h1>
          <ul>
            {
            isConnected() && 
              mainDashboard
            }
            { isAdmin() && <li><NavLink to="/register">Add user</NavLink></li> }
            { !isConnected() && <li><NavLink to="/login">Se connecter</NavLink></li> }
          </ul>
        </nav>
        
        <main className="content">
          <Outlet /> {/* Les pages s'affichent ici */}
        </main>
      </div>
      <footer>
        <p>
          Cet outil n'a pas de vocation à être utilisé dans un contexte professionnel ou sérieux. <br />
          Il est à utilisé avec du recul et un minimum de connaissance sur le sujet.
        </p>
      </footer>
    </>
  );
}

export default Dashboard;
