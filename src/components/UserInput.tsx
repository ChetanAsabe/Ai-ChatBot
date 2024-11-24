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
      <div className="flex justify-between items-center bg-gray-50 rounded-full fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg h-14 px-4 shadow-md">
        <input
            type="text"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeypress}
            placeholder="Send a message..."
            className="flex-grow bg-transparent focus:outline-none text-black text-lg placeholder-gray-500"
        />
        <button
            aria-label="Send message"
            onClick={handleSendMessage}
            className="bg-black text-white rounded-full px-4 py-2 text-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-black"
        >
          ➜
        </button>
      </div>
  );
};

export default UserInput;
