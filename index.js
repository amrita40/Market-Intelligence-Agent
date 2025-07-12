import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import YouTubeTranscriptPkg from "youtube-transcript";
const { YouTubeTranscript } = YouTubeTranscriptPkg;

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Market Intelligence Backend is running!");
});

const llm = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function scrapeURLWithFirecrawl(url) {
  const response = await axios.post(
    "https://api.firecrawl.dev/v0/scrape-url",
    {
      url: url,
      formats: ["markdown"],
      onlyMainContent: true,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
    }
  );
  return response.data;
}

// ✅ Analyze Website
app.post("/analyze-website", async (req, res) => {
  const { url, question } = req.body;

  try {
    const crawlResult = await scrapeURLWithFirecrawl(url);
    const context = crawlResult.formats.markdown;

    const prompt = new PromptTemplate({
      template: `
You are an experienced market analyst. Based on the content below, answer the question.

Website Content:
{context}

Question:
{question}
      `,
      inputVariables: ["context", "question"],
    });

    const chain = new ConversationChain({ llm });

    const finalPrompt = await prompt.format({ context, question });
    const answer = await chain.call({ input: finalPrompt });

    res.json({ result: answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Ask YouTube Question
app.post("/ask-youtube-question", async (req, res) => {
  console.log("✅ /ask-youtube-question called");
  const { videoUrlOrQuery, question } = req.body;

  try {
    let videoId;

    if (videoUrlOrQuery.startsWith("http")) {
      const url = new URL(videoUrlOrQuery);
      videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
    } else {
      return res.status(400).json({ error: "Search by query not implemented." });
    }

    const transcript = await YouTubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map((line) => line.text).join("\n");

    const chain = new ConversationChain({ llm });

    const inputText = `
This is the transcript of a YouTube video:

${transcriptText}

Now I'll ask you questions about it.

${question}
    `;

    const answer = await chain.call({ input: inputText });

    res.json({ result: answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Analyze LinkedIn
app.post("/analyze-linkedin", async (req, res) => {
  const { linkedinLink } = req.body;

  try {
    const parsedUrl = new URL(linkedinLink);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      return res.status(400).json({ error: "Invalid LinkedIn URL." });
    }

    const linkType = parts[0];
    const linkId = parts[1];

    const requestType = linkType === "company" ? "company" : linkType === "in" ? "profile" : null;
    const isPrivate = linkType === "in";

    if (!requestType) {
      return res.status(400).json({ error: "Unsupported LinkedIn link type." });
    }

    const response = await axios.get("https://api.scrapingdog.com/linkedin", {
      params: {
        api_key: process.env.SCRAPINGDOG_API_KEY,
        type: requestType,
        linkId,
        private: isPrivate,
      },
    });

    res.json({ result: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Structured Tool
app.post("/structured-tool", async (req, res) => {
  const { inputData } = req.body;

  try {
    const prompt = new PromptTemplate({
      template: `
You are a data processing agent. Process the input below and return a well-structured markdown output with headings, bullet points, and summary.

Input Data:
{inputData}
      `,
      inputVariables: ["inputData"],
    });

    const finalPrompt = await prompt.format({ inputData });

    const chain = new ConversationChain({ llm });
    const answer = await chain.call({ input: finalPrompt });

    res.json({ result: answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
