//Importing modules
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();
const MODEL = process.env.GPT_MODEL || "gpt-3.5-turbo";

//GPT configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openAi = new OpenAIApi(configuration);

export const getGPTResponse = async (content: string) => {
  try {
    const response = await openAi.createChatCompletion({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });
    return response.data.choices[0].message?.content;
  } catch (error) {
    console.log(error);
    return "Sorry cannot process this request";
  }
};
