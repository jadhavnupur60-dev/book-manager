
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, fallback }) {
  const { token } = useAuth();

  if (!token) {
    return fallback;
  }

  return children;
}

export default ProtectedRoute;
