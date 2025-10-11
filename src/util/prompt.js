const generatePrompt = (numberOfQuestion, topics, language) => `
Make exactly ${numberOfQuestion} MCQ in ${language}.
Rules:
- Topics: ${topics}.
- One topic per question.
- If Q > topics → distribute evenly.
- difficulty ∈ ["Easy","Normal","Hard","Very hard","Demon"].
- Translate both "topic" (if the topic language is provied != ${language}) and "difficulty" into ${language} only.
Return JSON:
[
  {
    "question": "...",
    "options": ["A...", "B...", "C...", "D..."],
    "answer": "B",
    "language": "${language}",
    "topic": "Math",
    "difficulty": "Hard"
  }
]
No explanation.
`;

module.exports = { generatePrompt };
