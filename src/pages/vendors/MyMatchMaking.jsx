import { useLocation, Navigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MatchMakingCalender from "../../components/MatchMakingCalender";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyMatchMaking() {
  const location = useLocation();

  // Validate ClientId from location.state
  const ClientId = useMemo(() => {
    const id = location.state?.passClientId;
    return typeof id === "string" && /^[\w-]+$/.test(id) ? id : null;
  }, [location.state?.passClientId]);

  if (!ClientId) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Local state for login status, default false
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Memoized callback to receive login status from Header
  const handleLoginStatusChange = useCallback((status) => {
    setIsLoggedIn(status);
  }, []);

  console.log("ClientId in MyMatchMaking:", ClientId);

  return (
    <>
      {/* Pass callback to Header */}
      <Header onLoginStatusChange={handleLoginStatusChange} passClientId={ClientId} />
      <div className="bg-pulse custom-div">
          {/* Pass isLoggedIn and ClientId as props */}
          <MatchMakingCalender ClientId={ClientId} isLoggedIn={isLoggedIn} autoCloseTime={false} />
        
      </div>
      <ToastContainer newestOnTop closeOnClick={false} draggable={false} position="top-center" />
      <Footer />
    </>
  );
}
