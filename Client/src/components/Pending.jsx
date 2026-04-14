import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";

export default function Pending() {
    const [pendings, setPendings] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { apiCall, user } = useAuth();

    useEffect(() => {
        async function fetchPending() {
            try {
                const response = await apiCall("get", "/protect/pending");
                setPendings(response.data.requests);
            } catch(e) {
                setError(e.response?.data?.message);
            } finally {
                setLoading(false)
            }
        }

        fetchPending();
    }, []);

    async function handleDelete(friendid) {
        try{
            const response = await apiCall("delete", "/protect/friendreq", {friendid: friendid});
            alert(response.data.message);
        } catch(e) {
            alert(e.response?.data?.message);
        }
    }

    async function handleAccept(friendid) {
        try{
            const response = await apiCall("put", "/protect/friendreq", {friendid: friendid});
            alert(response.data.message);
        } catch(e) {
            alert(e.response?.data?.message);
        }
    }

    if(loading) {
        return <h1 style={{textAlign: "center", marginTop: "100px"}}>Loading...</h1>
    }

    return (
        <>
            {error === "" ? 
            <div className="daddy-contacts">
                {pendings.map((pend) => {
                    return  <div key={pend.friendid} className="contact-card">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <h2>{pend.username} ({pend.status})</h2>
                                    <div style={{display: "flex", gap: "20px"}}>
                                        {user.id === pend.reqid ? null : <button onClick={() => {handleAccept(pend.friendid)}}>Accept</button>}
                                        <button onClick={() => {handleDelete(pend.friendid)}}>X</button>
                                    </div>
                                </div>
                            </div>
                })}
            </div> 
                : 
            <h1 style={{textAlign: "center", marginTop: "100px"}}>
                {error}
            </h1>}
        </>
    )
}
