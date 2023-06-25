import { Server, Socket } from "socket.io";
import { getGPTResponse } from "../openai";
import { saveAudioFileToS3, downloadTranscript } from "../aws";
import { startTranscribtion } from "../stt";
import { generateSpeech } from "../tts";

export const socketHandler = (socket: Socket, io: Server) => {
  //Listening to the audio data comming from the client
  socket.on("audio", async (data) => {
    const dataURL = data.audio.dataURL.split(",").pop();
    let fileBuffer = Buffer.from(dataURL, "base64");

    // const key = await saveAudioFileToS3(fileBuffer);
    // const fileKey = await startTranscribtion(key!!);

    // const text = await downloadTranscript(fileKey!!);
    // const gptResponse = await getGPTResponse(text);

    // const audio = await generateSpeech(gptResponse!!);

    // socket.emit("results", audio, text);

    await delay(5000);

    console.log("Hello this is going as planned");
    socket.emit("results", "fdsa", "fdsf");
  });

  //When socket get disconnected
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
