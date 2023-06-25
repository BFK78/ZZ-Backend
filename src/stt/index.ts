import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import promiseRetry from "promise-retry";
import { BUCKET, REGION, CREDENTIALS } from "../aws";
import { randomUUID } from "crypto";

const transcribeClient = new TranscribeClient({
  region: REGION,
  credentials: CREDENTIALS,
});

export const startTranscribtion = async (uri: string) => {
  console.log(uri);
  try {
    const params: StartTranscriptionJobCommandInput = {
      TranscriptionJobName: "transcribe-audio" + randomUUID(),
      LanguageCode: "en-US",
      Media: {
        MediaFileUri: uri,
      },
      OutputBucketName: BUCKET,
    };

    const startTranscribtionCommand = new StartTranscriptionJobCommand(params);
    const startTranscribtionResponse = await transcribeClient.send(
      startTranscribtionCommand
    );

    const TranscriptionJobName =
      startTranscribtionResponse.TranscriptionJob?.TranscriptionJobName;

    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: TranscriptionJobName,
    });

    // Poll the status of the job, and return the transcription job is complete
    await promiseRetry(
      async (retry) => {
        const response = await transcribeClient.send(command);

        if (response.TranscriptionJob?.TranscriptionJobStatus !== "COMPLETED") {
          // Not completed – retry in 2 seconds
          return retry(null);
        }

        // Completed
        return response.TranscriptionJob;
      },
      { minTimeout: 2000, forever: true }
    );

    return TranscriptionJobName + ".json";
  } catch (error) {
    console.error(error);
  }
};
