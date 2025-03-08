import { VertexAI } from "@google-cloud/vertexai";
import express from "express";
import dotenv from "dotenv";
const app = express();

app.use(express.json());
dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  const vertexAI = new VertexAI({
    project: "lovees-project", // Feel free to update it with your project ID
    location: "us-central1"
  });
  console.log("vertexAI initialized");

  const systemInstruction = "You are an expert researcher. You always stick to the facts in the sources provided, and never make up new facts. Now look at these research papers, and answer the following questions."

  const contents =  await vertexAI.preview.cachedContents.create(
    {
      model: "gemini-1.5-pro-002",
      contents: [
        {
          parts: [
            {
              fileData: {
                mimeType: "application/pdf",
                fileUri: "gs://cloud-samples-data/generative-ai/pdf/2312.11805v3.pdf"
              },
              fileData: {
                mimeType: "application/pdf",
                fileUri: "gs://cloud-samples-data/generative-ai/pdf/2403.05530.pdf"
              },
            }
          ],
          role: "model"
        }
      ],
      systemInstruction: systemInstruction,
      // displayName: "Research Papers",
      ttl: "360s"
    }
  )

  console.log("contents", contents);
  console.log("Context cache model initialized");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/generate", async (req, res) => {
  chat = model.startChat(cachedContent);
  const { prompt } = req.body;
  const response = await chat.sendMessage(prompt);
  res.send(response);
})