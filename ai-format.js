const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class OpenAIClient {
  constructor(apiKey, printer) {
    this.apiKey = apiKey;
    this.printer = printer;
  }

  async send(prompt, input) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: input },
        ],
      }),
    });

    const data = await response.json();
    this.printer.print(data.choices[0].message.content);
  }
}

class TogetherAIClient {
  constructor(apiKey, printer) {
    this.apiKey = apiKey;
    this.printer = printer;
  }

  async send(prompt, input) {
    const response = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: input },
          ],
        }),
      }
    );

    const data = await response.json();
    this.printer.print(data.choices[0].message.content);
  }
}

class OllamaAIClient {
  constructor(apiKey = 0, printer) {
    this.apiKey = apiKey;
    this.printer = printer;
  }

  async send(prompt, input) {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.1",
        messages: [
          { role: "assistant", content: prompt },
          { role: "user", content: input },
        ],
        stream: false,
        options: { temperature: 0.999 },
      }),
    });

    const data = await response.json();
    this.printer.print(data.message.content);
  }
}

class Printer {
  constructor() {}
  print(text) {
    console.log(text);
  }
}

const apiKey = process.env.OPENAI_API_KEY;
const togetherApiKey = process.env.TOGETHER_API_KEY;

const promptFile = process.argv.findIndex(
  (x) => x === "-p" || x === "--prompt"
);
let prompt = null;
if (promptFile) {
  prompt = require("./" + process.argv[promptFile + 1]);
}

const client = new OpenAIClient(apiKey, new Printer()); // new TogetherAIClient(togetherApiKey, new Printer());

const input = fs.readFileSync(0, "utf8");

client.send(prompt, input);
