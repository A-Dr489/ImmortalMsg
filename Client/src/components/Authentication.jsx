import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js";

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(false);
    const [loginInfo, setLoginInfo] = useState({Lemail:"", Lpassword: ""});
    const [registerInfo, setRegisterInfo] = useState({username: "", Remail: "", Rpassword: "", Cpassword: ""});
    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState({
        username:"",
        email: "",
        password: "",
        cpassword: "",
        server: ""
    });
    const navigate = useNavigate();
    const { login, register } = useAuth();

    function handleLogin(e) {
        const { value, id } = e.target;
        setLoginInfo((prev) => ({...prev, [id]: value}));
    }

    function handleRegister(e) {
        const {id, value} = e.target;
        setRegisterInfo((prev) => ({...prev, [id]: value}));
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setLoginError("");
        if (!loginInfo.Lemail || !loginInfo.Lpassword) {
            setLoginError('Please fill in all fields');
            return;
        }

        const result = await login(loginInfo.Lemail, loginInfo.Lpassword);
        if(!result.result) {
            setLoginError(result.message);
        } else {
            setLoginError("");
            alert('Login successful!');
            navigate("/");
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        setRegisterError({username: "", email: "", password: "", cPassword: "", server: ""});
        if(registerInfo.username.length < 3 || registerInfo.username.length > 22) {
            setRegisterError((prev) => ({...prev, username: "Username must be between 3 to 22"}));
            return;
        }
        if(registerInfo.Rpassword.length < 8) {
            setRegisterError((prev) => ({...prev, password: "Password must be at least 8 characters"}));
            return;
        }
        if(registerInfo.Cpassword !== registerInfo.Rpassword) {
            setRegisterError((prev) => ({...prev, cpassword: "The passwords are not matching"}));
            return;
        }

        const result = await register(registerInfo.username, registerInfo.Remail, registerInfo.Rpassword, registerInfo.Cpassword);
        if(!result.result) {
            setRegisterError((prev) => ({...prev, username: result.message.username, email: result.message.Remail, server: result.server}));
        } else {
            setRegisterError({username: "", email: "", password: "", cpassword: "", server: ""});
            alert('Registration successful! Please login.');
            navigate("/");
        }
    }

    return (
        <>
            <button onClick={() => {setIsLogin(true)}}>Login</button>
            <button onClick={() => {setIsLogin(false)}}>register</button>

            {isLogin?
                <form onSubmit={handleLoginSubmit}>
                    {loginError ? <h2>{loginError}</h2> : null}
                    <label htmlFor="Lemail">Email</label>
                    <input type="email" name="Lemail" id="Lemail" onChange={handleLogin} /> <br />

                    <label htmlFor="Lpassword">Password</label>
                    <input type="password" name="Lpassword" id="Lpassword" onChange={handleLogin}/> <br />

                    <button type="submit">Submit</button>
                </form>
                :
                <form onSubmit={handleRegisterSubmit}>
                    {registerError.server !== "" ? <h2>{registerError.server}</h2> : null}
                    <label htmlFor="username">Username {registerError.username}</label>
                    <input type="text" name="username" id="username" onChange={handleRegister}/> <br />

                    <label htmlFor="Remail">Email {registerError.email}</label>
                    <input type="email" name="Remail" id="Remail" onChange={handleRegister}/> <br />

                    <label htmlFor="Rpassword">Password {registerError.password}</label>
                    <input type="password" name="Rpassword" id="Rpassword" onChange={handleRegister}/> <br />

                    <label htmlFor="Cpassword">Confirm-Password {registerError.cpassword}</label>
                    <input type="password" name="Cpassword" id="Cpassword" onChange={handleRegister}/> <br />

                    <button type="submit">Submit</button>
                </form>
            }
        </>
    )
}