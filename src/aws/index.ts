//Importing modules
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

//AWS Global variables
export const REGION = "ap-south-1";
export const BUCKET = "zzbot-transcribe";
export const CREDENTIALS = {
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY!!,
  secretAccessKey: process.env.AWS_SDK_SECRET_KEY!!,
};

//S3 client configuration -> S3 client is required for using aws transcription.
const s3Client = new S3Client({
  region: REGION,
  credentials: CREDENTIALS,
});

//SaveAudioToS3 -> We are saving the audio file to S3 where aws transcription can access it.
export const saveAudioFileToS3 = async (audio: Buffer) => {
  try {
    const key = createAudioFileName();

    const payload = {
      Key: key,
      Bucket: BUCKET,
      Body: audio,
      ContentType: "audio/mp3",
    };

    const command = new PutObjectCommand(payload);
    await s3Client.send(command);

    return "https://zzbot-transcribe.s3.ap-south-1.amazonaws.com/" + key;
  } catch (error) {
    console.log(error);
  }
};

//downloadTranscipt -> Here we will be downloading the transcript output that is generated in S3.
export const downloadTranscript = async (key: string) => {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await s3Client.send(command);

    const data = await response.Body?.transformToString();

    const json = JSON.parse(data!!);

    return json.results.transcripts[0].transcript;
  } catch (error) {
    console.error("Error downloading transcript:", error);
  }
};

const createAudioFileName = () => {
  const id = randomUUID();
  return `AudioFiles/${id}.mp3`;
};
