import openai
import os

# Load API key from environment variables
openai.api_key = os.getenv("OPEN_AI_API")

async def enhance_note_content(content: str) -> str:
    """
    Enhance note content using OpenAI GPT.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Replace with "gpt-3.5-turbo" if needed
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional note enhancer for therapists. Rewrite the following note in a more professional, clinical tone while preserving accuracy and context.",
                },
                {"role": "user", "content": content},
            ],
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error enhancing note content: {e}")
        return content  # Return original content if enhancement fails
