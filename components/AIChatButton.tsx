import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

const AIChatButton = () => {
  const [chatBox, setChatBox] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setChatBox(true)} className="text-gray-50">
        <Bot size={20} className="mr-2" /> AI Chat
      </Button>
      <AIChatBox open={chatBox} onClose={() => setChatBox(false)} />
    </>
  );
};

export default AIChatButton;
