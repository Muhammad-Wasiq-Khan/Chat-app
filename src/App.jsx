import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Users from "./components/Users";
import { useStore } from "./useStore";
import { getInitials } from "./utils";

function App() {
  // const store = useStore()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className={"main-content"}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route path="/users" element={<Users />} />

            <Route path="/chat/:roomId" element={<Chat />} />


          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
