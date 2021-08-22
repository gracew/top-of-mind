import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(
    model="ada:ft-user-pjd1gsylxfwus4hxkrav7pke-2021-08-22-00-24-36",
    prompt="Did you know that elephants are mammals?" + " ->",
    max_tokens=1
)
print(response)
