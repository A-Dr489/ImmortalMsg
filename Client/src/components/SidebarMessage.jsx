import { useState, useMemo, memo } from "react";
import ProfileCircle from "../utills/ProfileCircle";
import { setTime } from "../utills/functions.js";

const SidebarMessage = memo(({conversations, openConversation}) => {
    const [search, setSearch] = useState("");

    const filteredConversations = useMemo(
        () =>
            conversations?.filter(conv =>
            conv.other_username
                .toLowerCase()
                .includes(search.toLowerCase())
            ),
        [conversations, search]
    );

    return (
        <>
          <div className="search-conv">
                <input className="search-input" onChange={(e) => {setSearch(e.target.value)}} value={search} style={{width: "80%"}} name="conv" id="conv" placeholder="Search Conversation" />
          </div>

          <div className="sidebar-conv">
                {filteredConversations?.map((conversation) => {
                    return <div key={conversation.convid} className="conv-card" onClick={() => {openConversation(conversation.convid)}}>
                                <ProfileCircle first={conversation.other_username} last={conversation.other_username} />
                                <div style={{width: "100%", padding: "10px 16px 20px 16px"}}>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <h2 style={{lineHeight: "0"}}>{conversation.other_username}</h2>
                                        <p>{setTime(conversation.latest_msg_time)}</p>
                                    </div>
                                    <p style={{margin: "0"}}>{conversation.latest_msg}</p>
                                </div>
                            </div>
                    })}
                          
          </div>
        </>
    )
})

export default SidebarMessage;