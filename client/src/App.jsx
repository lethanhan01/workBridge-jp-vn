import { useState } from "react";
import {Dashboard} from "./screens/dashboard";
import {Chat} from "./screens/chat";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("dashboard"); // "dashboard" | "chat"
  const [selectedContact, setSelectedContact] = useState(null);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setScreen("chat");
  };

  const handleBack = () => {
    setScreen("dashboard");
    setSelectedContact(null);
  };

  if (screen === "chat") {
    return <Chat contact={selectedContact} onBack={handleBack} />;
  }

  return <Dashboard onSelectContact={handleSelectContact} />;
}