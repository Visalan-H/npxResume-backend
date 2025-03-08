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
- Apply a **variety of colors** for different sections to enhance readability:
  - Headers: \${y.red(y.bold('HEADER'))}
  - Subheaders: \${y.yellow('Subheader'))}
  - Job Titles: \${y.green(y.bold('Job Title'))}
  - Company Names: \${y.cyan('Company Name')}
  - Dates: \${y.magenta('Date')}
  - Bullet Points: \${y.white('- Point')}
  - Bullet Points Headings: \${y.blue('Text')}
  - Emphasized Text: \${y.bold('Text')}
  - **Key-Value Pairs:**
    - Keys: \${y.blue('Key')}
    - Values: \${y.white('Value')}
- Preserve proper spacing and bullet points.
- IMPORTANT: Do not include any explanations, extra text, or import statements.

Resume text: ${req.body.text}

IMPORTANT: Return a valid JSON object following this schema:
{
  "formattedResume": "string"
}
Ensure the "formattedResume" value is the correctly formatted yoctocolors-cjs template literal with diverse colors.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.candidates[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("AI response is empty or invalid.");
        }

        // **Sanitize JSON Output**
        responseText = responseText.trim()
            .replace(/^```json/, '') // Remove leading ```json
            .replace(/^```/, '')      // Remove leading ```
            .replace(/```$/, '');     // Remove trailing ```

        const parsedResponse = JSON.parse(responseText);
        req.ai = parsedResponse.formattedResume;

        next();
    } catch (error) {
        console.error("AI Middleware Error");
        next(error);
    }
};

module.exports = aiMiddleware;
