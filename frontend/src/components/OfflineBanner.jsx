import { useOffline } from "../api";

function OfflineBanner() {
  const offline = useOffline();
  if (!offline) return null;
  return (
    <div className="offline_banner">
      Can't reach the cookbook right now - showing your saved recipes
    </div>
  );
}

export default OfflineBanner;
