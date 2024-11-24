import { useEffect, useRef, useState } from "react";
import getGeiniResponse from "../services/getGeminiResponse";
import UserInput from "./UserInput";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  sender: "user" | "gpt";
  content: string;
}

const Conversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      try {
        const res = await getGeiniResponse(prompt);
        const formattedRes = await formatResponse(res);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), sender: "gpt", content: formattedRes },
        ]);
      } catch (error) {
        console.error("Error fetching GPT response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: uuidv4(),
            sender: "gpt",
            content: "Something went wrong. Please try again later.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (prompt) get();
  }, [prompt]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatResponse = (res: string) => {
    res = res.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    res = res.replace(/\*(.*?)\*/g, "<em>$1</em>");
    res = res.replace(/^\* (.*)$/gm, "<ul><li>$1</li></ul>");
    return res;
  };

  const handleDataFromInput = (d: string) => {
    setMessages((prevMsg) => [
      ...prevMsg,
      { id: uuidv4(), sender: "user", content: d },
    ]);
    setPrompt(d);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-auto scroll-smooth max-h-[92vh]">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`text-lg px-3 py-1 m-3 rounded-lg w-fit max-w-[80%] overflow-hidden ${message.sender === "user"
                ? "bg-gray-100 ml-auto shadow"
                : "bg-gray-50 mr-auto shadow-lg"
                }`}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-[85vh] overflow-hidden">
            <p className="text-xl font-bold">How can I help you?</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-start items-center m-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex justify-center items-center w-full py-4 sm:py-6 lg:py-8">
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <UserInput onSendMessage={handleDataFromInput} />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
