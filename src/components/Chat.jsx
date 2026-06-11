import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInitials } from "../utils";
import { supabase } from "../config/supabase";

function Chat() {
  const { roomId } = useParams();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const [recieverUser, setRecieverUser] = useState();
  const [senderUser, setSenderUser] = useState();
  const [messages, setMessages] = useState([])
  
useEffect(() => {
  if (!roomId) return;

  getCurrentRoomdetails();
  getAlLChatsMessage();

  const channel = supabase
    .channel(`chat_room_${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages", // ✅ FIXED
        filter: `chat_room_id=eq.${roomId}`,
      },
      (payload) => {
        setMessages((prev) => [...(prev || []), payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [roomId]);



  const getCurrentRoomdetails = async () => {
    const userLogin = JSON.parse(localStorage.getItem("userData"));
    setSenderUser(userLogin);
    const { data, error } = await supabase
      .from("chat_room")
      .select("*")
      .eq("id", roomId)
      .maybeSingle();

    if (data != null) {
      if (data.sender_id == userLogin["id"]) {
        setRecieverUser({
          name: data.reciever_name,
          reciever_id: data.reciever_id,
        });
      }
      else {
        setRecieverUser({
          name: data.sender_name,
          reciever_id: data.sender_id,
        });
      }
    }
    console.log(data);
  };

  const chatMessages = [];

  async function handleSend(e) {
  e.preventDefault();

  if (!text.trim()) return;
  if (!senderUser || !recieverUser || !roomId) return;

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: senderUser.id,
        reciever_id: recieverUser.reciever_id,
        message: text,
        chat_room_id: roomId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log("Send message error:", error);
    return;
  }

  // safer update
  setMessages((prev) => [...(prev || []), data]);

  setText("");
}

  const getAlLChatsMessage = async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_room_id", roomId);

    if (error) {
      console.log("Message fetch error:", error);
      setMessages([]);
      return;
    }

    setMessages(data || []);
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          background: "#f4f6f9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "90vh",
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#0d6efd",
              color: "#fff",
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: "#fff",
                color: "#0d6efd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {getInitials(recieverUser?.name || "U")}
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  textTransform: "capitalize",
                  fontSize: "18px",
                }}
              >
                {recieverUser?.name}
              </h3>

              <small>Online</small>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              background: "#eef1f5",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#777",
                }}
              >
                <h2>👋</h2>
                <p>Start your conversation</p>
              </div>
            ) : (
              messages.map((v, i) => {
                const isMe = v.sender_id === senderUser?.id;

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        background: isMe ? "#0d6efd" : "#fff",
                        color: isMe ? "#fff" : "#000",
                        padding: "10px 14px",
                        borderRadius: "15px",
                        maxWidth: "70%",
                        fontSize: "14px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      }}
                    >
                      {v.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              padding: "12px",
              borderTop: "1px solid #ddd",
              background: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Type message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "30px",
                padding: "12px 15px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              style={{
                marginLeft: "10px",
                border: "none",
                background: "#0d6efd",
                color: "#fff",
                width: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;