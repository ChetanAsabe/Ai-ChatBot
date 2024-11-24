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
      <div className="h-screen flex justify-center items-center bg-gray-100 overflow-scroll">
        <div className="flex flex-col w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 h-full max-h-[90vh] bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Message Container */}
          <div className="flex-1 overflow-y-auto scroll-smooth p-4">
            {messages.length > 0 ? (
                messages.map((message) => (
                    <div
                        key={message.id}
                        className={`text-lg px-4 py-2 my-2 rounded-lg max-w-[80%] overflow-hidden ${
                            message.sender === "user"
                                ? "bg-blue-100 text-blue-900 ml-auto shadow-md"
                                : "bg-gray-200 text-gray-800 mr-auto shadow-sm"
                        }`}
                        dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                ))
            ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-xl font-semibold text-gray-600">
                    How can I help you?
                  </p>
                </div>
            )}

            {loading && (
                <div className="flex justify-start items-center m-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="flex justify-center items-center w-full py-4 sm:py-6">
            <div className="w-full px-4 sm:w-3/4 lg:w-2/3">
              <UserInput onSendMessage={handleDataFromInput} />
            </div>
          </div>
        </div>
      </div>
  );

};

export default Conversation;
