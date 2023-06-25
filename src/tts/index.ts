import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandInput,
} from "@aws-sdk/client-polly";
import { CREDENTIALS, REGION } from "../aws";

const pollyClient = new PollyClient({
  region: REGION,
  credentials: CREDENTIALS,
});

export const generateSpeech = async (text: string) => {
  try {
    const params: SynthesizeSpeechCommandInput = {
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Joanna",
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    return response.AudioStream?.transformToByteArray();
  } catch (error) {
    console.log(error);
  }
};
