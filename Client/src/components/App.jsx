import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { ENUM } from "../utills/enum.js"

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading]);

  function handleNav(navTo) {
    navigate(`${navTo}`);
  }

  function contactsCondition(location) {
    if(location == ENUM.PATH_CONTACTS || location == ENUM.PATH_PENDING || location == ENUM.PATH_ADDFRIEND) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {user ? 
        <div>
          <div className="daddy-nav">
            <h1><span style={{color: "cyan"}}>&lt;</span>ImmortalMsg <span style={{color: "cyan"}}>/&gt;</span></h1>
            <div className="links-holder">
                <button className={location.pathname === "/" ? "nav-selected" : "nav-button"} onClick={() => {handleNav(ENUM.PATH_MESSAGES)}}>Messages</button>
                <button className={contactsCondition(location.pathname) ? "nav-selected" : "nav-button"} onClick={() => {handleNav(ENUM.PATH_CONTACTS)}}>Contacts</button>
                <button className={location.pathname === ENUM.PATH_PROFILE ? "nav-selected" : "nav-button"} onClick={() => {handleNav(ENUM.PATH_PROFILE)}}>Profile</button>
            </div>
          </div>
          
          <Outlet />
        </div>
        : 
        null}
    </>
  )
}

export default App
