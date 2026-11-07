import { useRouteChange } from "../../components/helper/onRouteChange";

function AsyncBoundary({ loading, error, data, children, loadingFallback, errorFallback }) {
  if (loading) {
    return loadingFallback ?? <Spinner />;
  }

  if (error) {
    return errorFallback ? errorFallback(error) : <ErrorMessage error={error} />;
  }

  return children(data);
}

function useAsyncStatus({ loading, error }: {loading: boolean, error: Error | null}) {
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return null; // means "everything is fine, render your content"
}

function Spinner() {
  return <div className="spinner">Loading...</div>;
}

function ErrorMessage({ error }: {error: Error}) {
  return (
    <div className="error-box">
      <p>Something went wrong.</p>
      <p>{error.message ?? String(error)}</p>
    </div>
  );
}

function MissingTokenMessage() {
  const { goTo } = useRouteChange();
  return (
    <div>
      Vous devez être connecté en tant qu'administrateur.ice et/ou listeux.se pour faire cette action.
      <br />Veuillez vous reconnecter.
      <br />
      <button onClick={() => goTo("/home")}>Accueil</button>
    </div>
  )
}

function MissingToken({token}:{token: string | null}){
  if (token == null){
      return MissingTokenMessage
  }
  return null;
}

export { AsyncBoundary, useAsyncStatus, MissingToken, MissingTokenMessage }