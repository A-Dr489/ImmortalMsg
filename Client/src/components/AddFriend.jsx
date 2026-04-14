import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

export default function AddFriend() {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const { apiCall } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if(input.length < 3 || input.length > 22) {
            setError("Username must be 3 - 22 character");
            return
        }
        try{
            const response = await apiCall("post", "/protect/friendreq", {receiver: input});
            alert(response.data.message);
            setError("");
            setInput("");
        } catch(e) {
            setError(e.response?.data?.message);
            console.log(e);
        }
    }

    function handleField(e) {
        setInput(e.target.value);
    }
    
    return (
        <>
            <form className="daddy-add" onSubmit={handleSubmit}>
                <div>
                    <p style={{fontSize: "1.2em"}}>You can add your friend by providing the <span style={{color: "cyan"}}>username</span></p>
                    {error === "" ? null : <p style={{color: "red"}}>{error}</p>}
                    <input type="text" name="receiver" id="receiver" value={input} onChange={handleField} placeholder="Type Username" className="input-add"/>
                </div>
            </form>
        </>
    )
}
