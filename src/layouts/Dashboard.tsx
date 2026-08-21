import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css"

function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <nav className="navbar">
          <h1>Outil carbone des Mines</h1>
          <ul>
            <li><NavLink to="/login">Accueil</NavLink></li>
            <li><NavLink to="/users">Utilisateurs</NavLink></li>
            {/* <li><NavLink to="/food">Alimentation</NavLink></li>
            <li><NavLink to="/transport">Transport</NavLink></li>
            <li><NavLink to="/goods">Biens</NavLink></li> */}
            <li><NavLink to="/listes">Listes</NavLink></li>
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
