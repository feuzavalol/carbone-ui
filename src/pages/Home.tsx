import { useApi } from "../fetching/useApi";
import { useState, useCallback, useEffect } from "react";
import { API_URL } from "../constants/url";
import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/AuthContext";
import type { AuthUser } from "../types/authTypes";
import { AuthorisedRoles } from "../constants/roles";

function useAuthenticatedValidationText() { // Test function to try the auth
    const apiFetch = useApi();
    const [authenticatedValidationText, setAuthenticatedValidationText] = useState<String>("")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchAuthenticatedValidationText = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/auth/test`);
      const data = await response.json();
      setAuthenticatedValidationText(data["success"]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching welcome text:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchAuthenticatedValidationText();
  }, [fetchAuthenticatedValidationText]);
    
  return { authenticatedValidationText, loading, error };
};

function BaseWelcomeText() {
  let welcomeText = 
    <div>
      <h2>Bienvenue sur le site Bilan Carbone des Mines de Nancy ! </h2>
      <p>Cet outil n'a pour seul but que de comptabiliser les dépenses carbones des listes et des grosses assos des meilleures Mines de France !</p>
    </div>;
  let complementaryText = 
    <div>
      <p>Vous pouvez découvrir les bilans carbones des listes de cette année dans l'onglet Bilans !</p>
    </div>;
  return (
    <>
    {welcomeText}
    {complementaryText}
    </>
  );
}

function WelcomeText({user}: {user: AuthUser}){
  let welcomeText = 
  <div>
    <h2>Bienvenue sur le site Bilan Carbone des Mines de Nancy ! </h2>
    <p>Cet outil n'a pour seul but que de comptabiliser les dépenses carbones des listes et des grosses assos des meilleures Mines de France !</p>
  </div>;
  let complementaryText = <div></div>;
  if (AuthorisedRoles.includes(user.role)){
    complementaryText = 
    <div>
      <p>Si vous voyez ce message, c'est que vous faites partie de l'équipe qui va (ou qui a) aider à cette "comptabilité carbone", donc merci à vous !</p>
      <br />
      <p>Pour vous faire un rapide tour du propriétaire : vous avez dans l'onglet Listes la liste des assos et des listes dont vous pouvez remplir le bilan carbone.</p> 
      <br />
      <p>Les onglets Bilans servent à avoir des graphiques et autres outils visuels pour illustrer votre travail</p>
    </div>;
  }
  else{
    return <BaseWelcomeText />;
  }
  return (
    <>
    {welcomeText}
    {complementaryText}
    </>
  );
}

export default function Home(){
    const { authenticatedValidationText, loading, error } = useAuthenticatedValidationText();
    const { token } = useAuth();
    if (token == null){
      return (
        <div>
          <div>{authenticatedValidationText}</div>
          <BaseWelcomeText />
        </div>
      );
    }

    if (loading) return <div>Chargement du texte de bienvenue...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    const user: AuthUser = decodeJwt(token);
    return (
        <div>
            <div>{authenticatedValidationText}</div>
            <WelcomeText user={user}/>           
        </div>
    )
}