const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET,
});

const openAI = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let output = completion.choices[0].message.content.trim();

    if (output.startsWith("```")) {
      output = output
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    return {
      success: true,
      message: "Answer from openAI.",
      data: JSON.parse(output),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "There is an error while using openAI.",
      data: null,
    };
  }
};

module.exports = {
  openAI,
};
