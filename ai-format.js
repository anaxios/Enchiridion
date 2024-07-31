const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const prompt = `I. Title

The title is in all capital letters, with a double hash symbol (##) preceding it.

The title is a brief description of the main topic of the page.

II. Main Text

The main text is divided into sections, each with a heading in all capital letters, with a triple hash symbol (###) preceding it.

The sections are:

A description of a feast day or event.

A biography of a saint.

A hymn of praise or a quote from a church father.

A contemplation or reflection on a spiritual topic.

A homily or sermon on a specific topic.

Each section is separated from the others by a blank line.

There may be a section that is not listed.

III. Section Headings

Section headings are usually a brief description of the content of the section. The number index should be removed. 
Do not replace the section heading text if it has one. If it doesn't have one, add one that is appropriate to the section. An appropriate
heading may be the names of the saints or the topics of the feasts.

IV. Text Formatting

The text is written in a formal, liturgical style.

Sentences are often long and complex, with multiple clauses.

The text includes quotes from scripture and church fathers, which are set off in italics.

The text also includes rhetorical questions and exclamations.

V. Special Formatting

The text includes special formatting for certain elements, such as:

Scripture quotes, which are set off in italics and include the book and chapter of the quote.

Names of saints and church fathers, which are in bold font.

Liturgical phrases and quotes, which are in italics.

VI. Conclusion

The text concludes with a prayer or a final thought, which is set off from the rest of the text by a blank line.

The conclusion is often a brief summary of the main points of the text, or a final reflection on the topic.`;
// prettier-ignore
const prompt2 = `
Format the given text following these directions:

- Replace the existing headers with standardized headers using Markdown and remove numbers.
- Use header levels (##, ###) to create a hierarchical structure for the text.
- Use a consistent naming convention for section titles.
- Add empty lines between sections to create a clear separation between different parts of the text.
- Remove the YAML front-matter (---) and any unnecessary metadata.
- Keep the original text intact, without any changes to the content or formatting within the sections apart from punctuation and typos.
`;

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

const apiKey = process.env.OPENAI_API_KEY;
const togetherApiKey = process.env.TOGETHER_API_KEY;

const client = new OpenAIClient(apiKey, new Printer()); // new TogetherAIClient(togetherApiKey, new Printer());

const input = fs.readFileSync(0, "utf8");

client.send(prompt2, input);

class Printer {
  constructor() {}
  print(text) {
    console.log(text);
  }
}
