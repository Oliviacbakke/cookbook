// Shows "Loading..." or an error with a retry button. Renders nothing when ready.
function LoadState({ loading, error, onRetry }) {
  if (loading) return <p className="status_box">Loading...</p>;
  if (error) {
    return (
      <div className="status_box">
        <p>{error.message}</p>
        {onRetry && (
          <button className="retry_button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }
  return null;
}

export default LoadState;
