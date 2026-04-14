import { useState, useEffect, useRef, useCallback } from "react"
import ProfileCircle from "../utills/ProfileCircle";
import SidebarMessage from "./SidebarMessage.jsx";
import ConvChannel from "./ConvChannel.jsx";
import { SOCKET_EVENT } from "../utills/enum";
import { useAuth } from "../hooks/useAuth.js";
import { useSocket } from "../hooks/useSocket.js"

export default function Messages() {
    const [msg, setMsg] = useState(""); //input field
    const [conversations, setConversations] = useState();
    const [selectedConversation, setSelectedCoversation] = useState(null);
    const [userMsgs, setUserMsgs] = useState([]);
    const scroll = useRef(false);   //scroll to bottom when the conversation opens without re-render
    const { apiCall } = useAuth();
    const { socket } = useSocket();

    
    //This might be changed to socket
    useEffect(() => {
        async function fetchContacts() {
            try{
                const response = await apiCall("get", "/protect/conversation");
                setConversations(response.data.conversations);
                // console.log(response.data.conversations);
            } catch(e) {
                console.log(e.response.data.message);
            }
        }

        fetchContacts();
    }, []);

    useEffect(() => {
        socket.on(SOCKET_EVENT.RECEIVE_CONVERSATION, (msgs) => {    //array of messages
            setUserMsgs(msgs.reverse());    //msgs[0] is the oldest in the chain
            scroll.current = !scroll.current;
        });

        socket.on(SOCKET_EVENT.MESSAGE_CLIENT, (rows) => {    //array of messages
            setUserMsgs(prev => [...prev, rows]);
        });

        return () => {
            socket.off(SOCKET_EVENT.RECEIVE_CONVERSATION);
            socket.off(SOCKET_EVENT.MESSAGE_CLIENT);
        }
    }, [socket]);
    
    //need deep thinking
    const openConversation = useCallback((convid) => {
        const selected = conversations.find(item => item.convid === convid);
        if(selectedConversation && selected.convid === selectedConversation.convid) return;
        setSelectedCoversation(selected);
        socket.emit(SOCKET_EVENT.OPEN_CONVERSATION, convid, selected.room);
        // console.log('ez')
    }, [conversations, socket, selectedConversation]);

    const setMessages = useCallback((val) => {
        setUserMsgs(val);
    }, []);
    
    //SEND button
    function handleSendMsg(e) {
        e.preventDefault();
        if(msg !== "" && selectedConversation) {
           socket.emit(SOCKET_EVENT.MESSAGE_SERVER, msg, {
                convid: selectedConversation.convid, 
                userid: selectedConversation.other_id,
                room: selectedConversation.room,
                username: selectedConversation.other_username
            });
           console.log("sent");
           setMsg("");
        }
    }

    return (
        <>
          <div className="daddy-message">
            
            <SidebarMessage conversations={conversations} openConversation={openConversation}/>
            
            {selectedConversation ? 
                <div className="profile-holder">
                    <div style={{display: "flex", gap: "20px", alignItems: "center"}}>
                        <ProfileCircle first={selectedConversation?.other_username} last ={selectedConversation?.other_username}/>
                        <div>
                            <h2 style={{lineHeight: "0"}}>{selectedConversation?.other_username}</h2>
                            <p style={{color: "rgba(0, 255, 255, 0.83)"}}>offline</p>
                        </div>
                    </div>

                    <h1>:</h1>
                    
                </div> : <div></div>
            }

            <ConvChannel userMsgs={userMsgs} setUserMsgs={setMessages} scroll={scroll.current}/>

            {selectedConversation ? 
                <form className="send-holder" onSubmit={handleSendMsg}>
                    <input className="search-input" onChange={(e) => {setMsg(e.target.value)}} value={msg} style={{width: "60%"}} name="send" id="send" placeholder="Type Message" />
                    <button type="submit" className="send-btn">SEND</button>
                </form>
                :
                <div></div>
            }
            
          </div>
        </>
    )
}
