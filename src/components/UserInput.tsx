import React, { useState } from "react";

interface UserInputProps {
  onSendMessage: (message: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSendMessage }) => {
  const [userInput, setUserInput] = useState("");

  const handleChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-full absolute bottom-0 w-[44vh] h-14 text-center m-2 pe-2 ps-1">
      <input
        type="text"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeypress}
        placeholder="Send a message.."
        className="p-2 bg-transparent w-full focus:outline-none text-black text-lg"
      />
      <button
        aria-label="Send message"
        onClick={handleSendMessage}
        className="bg-black text-white rounded-full px-4 py-2 text-lg"
      >
        ➜
      </button>
    </div>
  );
};

export default UserInput;
