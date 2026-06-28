import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";

/**
 * Wrap any route group that requires login.
 * Pass `allowedRoles` to additionally restrict by role — e.g. ["superadmin"].
 * If `allowedRoles` is omitted, any logged-in role can pass.
 *
 * Falls back to localStorage so a hard-refresh doesn't kick the user out
 * before the Redux store re-hydrates from the persisted token.
 */
function ProtectedRoute({ allowedRoles }) {
   const { token: reduxToken, user: reduxUser } = useSelector((state) => state.auth);

   // Fallback: if Redux hasn't hydrated yet, read from localStorage
   const token = reduxToken || localStorage.getItem("token");
   const user  = reduxUser  || (() => {
      try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
   })();

   if (!token || !user) {
      return <Navigate to={ROUTES.LOGIN} replace />;
   }

   if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={ROUTES.LOGIN} replace />;
   }

   return <Outlet />;
}

export default ProtectedRoute;