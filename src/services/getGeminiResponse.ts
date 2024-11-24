import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeiniResponse = async (prompt: string): Promise<string> => {
  try {
    const genAi = new GoogleGenerativeAI(
      "AIzaSyDs7RuE5tst_r1XAoOMmIhgt-QeGEHJXCc"
    );
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const response = await model.generateContent(prompt);

    if (
      response &&
      response.response &&
      typeof response.response.text === "function"
    ) {
      return response.response.text();
    } else {
      throw new Error("Invalid response format from API");
    }
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown Error occured!";
  }
};

export default getGeiniResponse;
