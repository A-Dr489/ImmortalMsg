import { Link, Outlet } from "react-router-dom";
import { ENUM } from "../utills/enum.js";

export default function ContactsNav() {


    return (
        <>
            <div className="daddy-contact-nav">
                <div style={{display: "flex", borderBottom: "1px solid cyan", gap: "80px", padding: "15px 70px"}}>
                    <Link to={ENUM.PATH_CONTACTS} className="contact-nav-link">Friends</Link>
                    <Link to={ENUM.PATH_PENDING} className="contact-nav-link">Pending</Link>
                    <Link to={ENUM.PATH_ADDFRIEND} className="contact-nav-link">Add Friend</Link>
                </div>
            </div>

            <Outlet />
        </>
    )
}
