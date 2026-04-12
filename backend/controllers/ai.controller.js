export const explainBug = async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `
You are a senior developer.

Bug Title: ${title}
Bug Description: ${description}

Respond EXACTLY in this format:

Cause:
<1 short sentence>

Fix:
- point 1
- point 2
- point 3

Keep it short.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    const result = data?.choices?.[0]?.message?.content || null;

    //  Fallback if AI fails
    if (!result) {
      return res.json({
        result: generateFallback(title, description),
      });
    }

    res.json({ result });
  } catch (error) {
    console.error("AI ERROR:", error);

    res.json({
      result: generateFallback(req.body.title, req.body.description),
    });
  }
};

// Fallback system
function generateFallback(title = "", description = "") {
  const text = (title + " " + description).toLowerCase();

  if (text.includes("401") || text.includes("unauthorized")) {
    return " Authentication issue. Check token, login flow, or headers.";
  }

  if (text.includes("404")) {
    return " Endpoint not found. Verify API route.";
  }

  if (text.includes("network")) {
    return " Network issue. Check backend or API URL.";
  }

  if (text.includes("undefined")) {
    return " Possible undefined variable. Add checks and logs.";
  }

  return " Debug step-by-step using logs and validation.";
}
