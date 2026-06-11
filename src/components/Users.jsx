import { Link, useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

function Users() {

  const [user, setUser] = useState([]);
  const [loginUser, setLoginUser] = useState();
  const [senderUser, setSenderUser] = useState();

  let nav = useNavigate()

  useEffect(() => {
    getAlLusers();
  }, []);

  const getAlLusers = async () => {
    const userLogin = JSON.parse(localStorage.getItem("userData")); //login user data get
    setLoginUser(userLogin);
    setSenderUser(userLogin);
    const { data, error } = await supabase
      .from("users")
      .select("")
      .neq("id", userLogin["id"]);

    console.log(data);
    setUser(data);
  };

  //room create room not find : create return room id
  const createChatRoom = async (v) => {
// console.log(v.id)
    //get room id
    const { data, error } = await supabase
      .from("chat_room")
      .select("*")
      .or(
        `and(sender_id.eq.${loginUser.id},reciever_id.eq.${v.id}),and(sender_id.eq.${v.id},reciever_id.eq.${loginUser.id})`,
      )
      .maybeSingle();

    if (!data) {
      const { data: newRoom, error } = await supabase
        .from("chat_room")
        .insert([
          {
            sender_id: loginUser.id,
            reciever_id: v.id,
            sender_name: loginUser.name,
            reciever_name: v.name,
          },
        ]).select()
      if (error) {
        console.log(error.messaege)
      } else {
        console.log(newRoom);
        alert("NEW ROOM CREATE")
        nav("/chat/" + newRoom[0].id)
        return
      }
    }
    console.log(data)
    alert("ALREADY ROOM CREATE")

    nav("/chat/" + data.id)

  };


 return (
  <div className="min-h-screen bg-gray-100">
    {/* Header */}
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500">
          Select someone to start a conversation
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {senderUser?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold capitalize">
            {senderUser?.name}
          </h3>
        </div>
      </div>
    </div>

    {/* User List */}
    <div className="max-w-3xl mx-auto p-6">
      {user.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Users Found
          </h2>
          <p className="text-gray-500 mt-2">
            Sign up another account to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {user.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                  {u.name?.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {u.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {u.email}
                  </p>
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={() => createChatRoom(u)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default Users;
