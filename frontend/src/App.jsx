import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/Chatpage";
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage/>} />
      </Routes>
    </div>
  );
};

export default App;
