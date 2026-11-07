import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/AuthContext";
import type { AuthUser } from "../types/authTypes";
import { AuthorisedRoles } from "../constants/roles";
import { useFetch } from "../fetching/helper/useFetch";
import { type BaseAnswer, EmptyAnswer } from "../types/request";

function useAPIOnlineText() { // Test function to make sure the API in online
  const path: string = "/auth/test";
  const { data, loading, error } = useFetch<BaseAnswer<string>>(path, EmptyAnswer<string>());
  return { authenticatedValidationText: data.success, loading, error }
};

function ComplementaryText({user}: {user: AuthUser | null}){
  let authorised = user != null && AuthorisedRoles.includes(user.role);
  return (
    <>
      {
        authorised && 
        <div>
          <p>Si vous voyez ce message, c'est que vous faites partie de l'équipe qui va (ou qui a) aider à cette "comptabilité carbone", donc merci à vous !</p>
          <br />
          <p>Pour vous faire un rapide tour du propriétaire : vous avez dans l'onglet Listes la liste des assos et des listes dont vous pouvez remplir le bilan carbone.</p> 
          <br />
          <p>La section "Database" vous permet de voir, d'ajouter et de modifier les données chiffrées utilisées par tous</p>
        </div> 
      }
      { !authorised &&    
        <div>
          <p>Vous pouvez découvrir les bilans carbones des listes/assos de cette année dans l'onglet Bilans !</p>
          <p>(cette fonctionnalité n'est peut-être pas encore en ligne)</p>
        </div>
      }
    </>
  )
}

function BaseWelcomeText() {
  return (
    <div>
      <h2>Bienvenue sur le site Bilan Carbone des Mines de Nancy ! </h2>
      <p>Cet outil n'a pour seul but que de comptabiliser les dépenses carbones des listes et des grosses assos des meilleures Mines de France !</p>
    </div>
  )
}

function WelcomeText({user}: {user: AuthUser | null}){
  return (
    <>
    <BaseWelcomeText />
    <ComplementaryText user={user} />
    </>
  );
}

export default function Home(){
    const { authenticatedValidationText, loading, error } = useAPIOnlineText();
    const { token } = useAuth();
    

    if (loading) return <div>Chargement du texte de bienvenue...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    const user: AuthUser | null = token != null ? decodeJwt(token) : null;
    return (
        <div>
            <div>{authenticatedValidationText}</div>
            <WelcomeText user={user}/>           
        </div>
    )
}