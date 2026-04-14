import { Outlet, Link } from "react-router-dom";
import { ENUM } from "../../utills/enum";

export default function Profile() {
    
    return (
        <>
            <div className="daddy-profile">
                <div className="profile-settings">
                    <h1 style={{ textAlign: "center", margin: "35px 0px" }}>Settings</h1>
                    <Link className="profile-links" to={ENUM.PATH_MYACCOUNT}>My Account</Link>
                    <Link className="profile-links">Apperance</Link>
                </div>

                <div style={{flex: 3, overflowY: "auto"}}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}
