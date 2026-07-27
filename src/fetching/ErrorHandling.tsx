function AsyncBoundary({ loading, error, data, children, loadingFallback, errorFallback }) {
  if (loading) {
    return loadingFallback ?? <Spinner />;
  }

  if (error) {
    return errorFallback ? errorFallback(error) : <ErrorMessage error={error} />;
  }

  return children(data);
}

function useAsyncStatus({ loading, error }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return null; // means "everything is fine, render your content"
}

function Spinner() {
  return <div className="spinner">Loading...</div>;
}

function ErrorMessage({ error }) {
  return (
    <div className="error-box">
      <p>Something went wrong.</p>
      <p>{error.message ?? String(error)}</p>
    </div>
  );
}

export { AsyncBoundary, useAsyncStatus }