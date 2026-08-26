import { useApi } from "../fetching/useApi";
import { useState, useCallback, useEffect } from "react";
import { API_URL } from "../constants/url";
import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/AuthContext";
import type { AuthUser } from "../types/authTypes";

function useAuthenticatedValidationText() {
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

function WelcomeText({user}: {user: AuthUser}){
  let welcomeText = 
  <div>
    <h2>Bienvenue sur le site Bilan Carbone des Mines de Nancy ! </h2>
    <p>Cet outil n'a pour seul but que de comptabiliser les dépenses carbones des listes et des grosses assos des meilleures Mines de France !</p>
  </div>;
  let complementaryText = <div></div>;
  if (user.role === "ADM"){
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
    complementaryText = 
    <div>
      <p>Vous pouvez découvrir les bilans carbones des listes de cette année dans l'onglet Bilans !</p>
    </div>;
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
      return;
    }

    if (loading) return <div>Chargement du texte de bienvenue...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    const user: AuthUser = decodeJwt(token);
    return (
        <div>
            <div>{authenticatedValidationText}</div>
            <WelcomeText user={user}/>
            {token && (
              <div style={styles.result}>
                <p style={styles.resultLabel}>Token received:</p>
                <textarea style={styles.tokenBox} readOnly value={token} rows={5} />
                <button
                  type="button"
                  style={styles.copyButton}
                  onClick={() => navigator.clipboard.writeText(token)}
                >
                  Copy token
                </button>
              </div>
            )}
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    width: 360,
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    color: "#888",
    fontSize: 14,
  },
  tabActive: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid #2563eb",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    color: "#333",
    gap: 4,
  },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  submit: {
    marginTop: 8,
    padding: "10px 0",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 16,
    color: "#dc2626",
    fontSize: 13,
  },
  result: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #e0e0e0",
  },
  resultLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  tokenBox: {
    width: "100%",
    fontSize: 11,
    fontFamily: "monospace",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
    resize: "none",
    boxSizing: "border-box",
  },
  copyButton: {
    marginTop: 8,
    padding: "6px 12px",
    fontSize: 13,
    background: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  },
};