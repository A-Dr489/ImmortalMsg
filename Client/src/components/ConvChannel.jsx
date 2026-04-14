import { useState, useRef, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../hooks/useAuth.js";
import { setTime } from "../utills/functions.js";

const ConvChannel = memo(({ userMsgs, setUserMsgs, scroll }) => {
    const [msgLoading, setMsgLoading] = useState(false);
    const [error, setError] = useState("");
    const messageBottom = useRef(null);
    const chatContainer = useRef(null);
    const { ref, inView } = useInView({root: chatContainer.current});
    const { user, apiCall } = useAuth();

    useEffect(() => {
        //maybe change the catch for this function
        async function loadOldMsg() {
            if(!chatContainer.current || msgLoading) return;
            if(userMsgs.length > 19) {
                const container = chatContainer.current;
                const prevHeight = container.scrollHeight;
                setMsgLoading(true);
                try{
                    const response = await apiCall("post", "/protect/oldmsg", {
                        msgid: userMsgs[0].msgid,
                        convid: userMsgs[0].convid
                    });
                                
                    const oldMsg = response.data.olderMsg.reverse();
                    setUserMsgs((prev) => [...oldMsg, ...prev]);
            
                    requestAnimationFrame(() => {
                        const newHeight = container.scrollHeight;
                        container.scrollTop = container.scrollTop + (newHeight - prevHeight);
                    });
                    setMsgLoading(false);
                } catch(e) {
                    console.log(e.response?.data?.message);
                    if(e.response.data.ok) {
                        setError(e.response?.data?.message);
                    }
                }
            }
        }

        if(inView) {
            loadOldMsg();
        }
    }, [inView]);

    useEffect(() => {
        messageBottom.current?.scrollIntoView({ behavior: "instant" });
    }, [scroll]);

    return (
        <>
            <div className="content-conv" ref={chatContainer}>
                <div ref={ref}></div>

                <h1 style={{textAlign: "center"}}>{error !== ""? error : msgLoading? "Loading..." : null}</h1>
                {userMsgs.length !== 0 ? 
                    userMsgs.map((message) => {
                        return <div key={message.msgid} className={message.senderid === user.id ? "my-position" : "enemy-position"}>
                                    <div className={message.senderid === user.id ? "my-box" : "enemy-box"}>
                                        <p style={{margin: 0, marginBottom: "6px"}}>{message.content}</p>
                                        <p style={{margin: 0, color: "rgb(189, 189, 189)"}}>{setTime(message.createdat)}</p>
                                    </div>
                                </div>
                    })
                    :
                    <h1 style={{textAlign: "center"}}> :) </h1>
                }
                <div ref={messageBottom}></div>
                
            </div>
        </>
    )
})

export default ConvChannel