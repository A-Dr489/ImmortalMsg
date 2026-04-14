import ProfileCircle from "../../utills/ProfileCircle";
import { useAuth } from "../../hooks/useAuth.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
    const [passwordChange, setPasswordChange] = useState({currentP: "", newP: "", CnewP: ""});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading, apiCall } = useAuth();
    const dialogRef = useRef(null);

    useEffect(() => {
        if(!user && !loading) {
            navigate("/auth")
        }
    }, [user, loading]);

    useEffect(() => {
        if(!dialogRef.current) return;

        dialogRef.current.addEventListener("close", closeModal);
        // console.log(document.documentElement.getAttribute("data-theme"));
        return () => {
            if(dialogRef.current) {
                dialogRef.current.removeEventListener("close", closeModal);
            }
        }
    }, []);

    function handleInput(e) {
        const { id, value } = e.target

        setPasswordChange((prev) => ({
            ...prev,
            [id]: value
        }))
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        if(passwordChange.newP.length < 7 || passwordChange.CnewP.length < 7) {
            setError("The passwords must be at least 8 length");
            return;
        }
        if(passwordChange.newP !== passwordChange.CnewP) {
            setError("The password is not the same as Confirm Password");
            return
        }

        const accept = confirm("Are you sure?");
        if(accept) {
            try{
                const response = await apiCall("put", "/protect/password", {
                    current: passwordChange.currentP,
                    newPassword: passwordChange.newP,
                    confirmNewPassword: passwordChange.CnewP
                });

                closeModal();
                alert(response.data.message);
            } catch(e) {
                console.log(e);
                setError(e.response?.data?.message);
            }
        }
    }

    function closeModal() {
        dialogRef.current?.close();
        setError('');
        setPasswordChange({currentP: "", newP: "", CnewP: ""});
    }

    async function handleDeleteAccount() {
        const accept1 = confirm("Are you sure?");
        if(accept1) {
            const accept2 = confirm("Are you really sure??");
            if(accept2) {
                try{
                    const response = await apiCall("delete", "/protect/kill");

                    alert(response.data.message);
                    navigate("/auth");
                } catch(e) {
                    alert(e.response?.data?.message);
                }
            }
        }
    }

    if(loading) {
        return <h1 style={{textAlign: "center"}}>Loading ...</h1>
    }

    return (
        <>
            <div style={{display: "flex", flexDirection: "column", padding: "100px 150px 50px 150px"}}>
                <div style={{ display: "flex", gap: "15px", marginBottom: "40px"}}>
                    <ProfileCircle first={user.username} last={user.username} width={"75px"} height={"75px"}/>
                    <div>
                        <h2 style={{ marginBottom: 0, marginTop: "20px", fontSize: "2em"}}>{user.username}</h2>
                        <p style={{ marginTop: 2, color: "rgb(162, 162, 162)"}}>User since {new Date(user.createdat).getFullYear()}</p>
                    </div>
                </div>

                <div style={{backgroundColor: "rgb(24, 24, 24)", padding: "20px 50px", borderRadius: "7px"}}>
                    <div style={{marginBottom: "40px"}}>
                        <h2 style={{marginBottom: 0}}>Username:</h2>
                        <h3 style={{marginTop: 10, color: "cyan", fontSize: "1.3em"}}>{user.username}</h3>
                    </div>

                    <div style={{marginBottom: "40px"}}>
                        <h2 style={{marginBottom: 0}}>Displayed Name:</h2>
                        <h3 style={{marginTop: 10, color: "cyan", fontSize: "1.3em"}}>{user.username}</h3>
                    </div>

                    <div>
                        <h2 style={{marginBottom: 0}}>Email:</h2>
                        <h3 style={{marginTop: 10, color: "cyan", fontSize: "1.3em"}}>{user.email}</h3>
                    </div>
                </div>

                <h1 style={{marginTop: "50px"}}>Forgot Your Password?</h1>
                <div>
                    <button className="button1" onClick={() => dialogRef.current?.showModal()}>Change Password</button>
                </div>

                <dialog className="form-dialog" ref={dialogRef}>
                    <form onSubmit={handleChangePassword}>
                        <h1>Update Your Password</h1>
                        <h3 style={{color: "red", marginBottom: "40px"}}>{error}</h3>
                        <div style={{marginBottom: "40px"}}>
                            <label style={{fontSize: "1.2em"}} htmlFor="currentP">Current Password:</label>
                            <input className="myAccount-inputs" type="text" name="currentP" id="currentP" value={passwordChange.currentP} onChange={(e) => {handleInput(e)}}/>
                        </div>

                        <div style={{marginBottom: "40px"}}>
                            <label style={{fontSize: "1.2em"}} htmlFor="newP">New Password: </label> <br />
                            <input className="myAccount-inputs" type="password" name="newP" id="newP" value={passwordChange.newP} onChange={(e) => {handleInput(e)}}/>
                        </div>

                        <div style={{marginBottom: "40px"}}>
                            <label style={{fontSize: "1.2em"}} htmlFor="CnewP">Confirm New Password: </label> <br />
                            <input className="myAccount-inputs" type="password" name="CnewP" id="CnewP" value={passwordChange.CnewP} onChange={(e) => {handleInput(e)}}/>
                        </div>

                        <div style={{display: "flex", gap: "40px"}}>
                            <button onClick={() => closeModal()} type="button" className="button2" style={{flex: 1}}>Cancel</button>
                            <button type="submit" className="button1" style={{flex: 1}}>Confirm</button>
                        </div>
                    </form>
                </dialog>

                <h1 style={{marginTop: "50px"}}>Account Removal!</h1>
                <div>
                    <button onClick={() => handleDeleteAccount()} className="Delete-dangours">Delete Account</button>
                </div>
            </div>
        </>
    )
}
