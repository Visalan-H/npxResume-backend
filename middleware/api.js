const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const aiMiddleware = async (req, res, next) => {
    try {
        const prompt = `Format the following resume text into a yoctocolors-cjs template literal string. 

The output should:
- Start and end with a single backtick (\`).
- Use 'yoctocolors-cjs' for styling (e.g., \${y.bold(y.blue('Text'))}).
- Apply appropriate colors for different sections:
  - Headers: \${y.red(y.bold('HEADER'))}
  - Subheaders: \${y.yellow('Subheader')}
  - Emphasized text: \${y.bold('Text')}
- Preserve proper spacing and bullet points.
- IMPORTANT: Do not include any explanations, extra text, or import statements. 

Resume text: ${req.body.text}

IMPORTANT:Return only the formatted template literal string with correct yoctocolors-cjs syntax.`;
        const result = await model.generateContent(prompt);
        req.ai = result.response.candidates[0].content.parts[0].text;
        console.log(result.response.candidates[0].content.parts[0])
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = aiMiddleware;
