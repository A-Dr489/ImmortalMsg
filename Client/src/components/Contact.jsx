import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
    const { apiCall } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchContacts() {
            try{
                const response = await apiCall("get", "/protect/contacts");
                setContacts(response.data.users);
            } catch(e) {
                console.log(e.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, []);

    async function createConversation(userid) {
        try {
            const response = await apiCall("post", "/protect/conversation", {userid: userid});
            alert(response.data.message);
        } catch(e) {
            alert(e.response.data.message);
            if(e.response?.data?.ok) {
                    navigate("/");
            }
        }
    }

    if(loading) {
        return <h1 style={{textAlign: "center", marginTop: "150px"}}>Loading ...</h1>
    }

    return (
        <>
          {contacts.length === 0 ? 
            <h1 style={{textAlign: "center", marginTop: "150px"}}>No users</h1>
            :
            <div className="daddy-contacts">
                {contacts.map((contact) => {
                    return <div key={contact.id} className="contact-card">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <h2>{contact.username}</h2>
                                    <button onClick={() => {createConversation(contact.id)}}>start</button>
                                </div>
                            </div>
                })}
            </div>
          }  
        </>
    )
}
