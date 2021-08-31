// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors()
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// set reponses
const responses_c = [ // congratulate
  "Congratulations! Best of luck.",
  "Great to hear!",
  "This is amazing. Congrats!",
  "So happy to hear. Congratulations!!",
  "This is wonderful news.",
  "I'm so proud of you. No one deserves this more.",
]
const responses_a = [ // acknowledge
  "Very interesting. Thank you for sharing.",
  "I learned something new today!",
  "Thank you for taking the time to share this.",
  "A very thought-provoking post.",
  "This was a fascinating read.",
  "Great thought leadership.",
]
const responses_s = [ // share
  "Happy to share this with my network.",
  "Let me know how I can help amplify.",
  "I can share with my network if you'd like.",
  "Do you need help signal-boosting?",
  "I'm happy to make intros that would be helpful.",
  "I'll be on the lookout for you.",
]
const responses_all = [...responses_c, ...responses_a, ...responses_s]

// https://nextjs.org/docs/api-routes/api-middlewares#connectexpress-middleware-support
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

/**
 * Requests are a list where each entry has 'id' and 'postText' fields.
 * Responses are a dictionary from post ID to a list of suggested comments.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string[]>>
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  const result: Record<string, string[]> = {};
  await Promise.all(req.body.map(async (post: any) => {
    try {
      const res = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENAI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: post.text.split(" ").splice(0, 30).join(" ") + ' ->',
          model: 'ada:ft-user-pjd1gsylxfwus4hxkrav7pke-2021-08-22-00-24-36',
          max_tokens: 1
        })
      });
      const data = await res.json()
      const action = data.choices[0].text
      if (action == ' c') {
        result[post.id] = responses_c
      } else if (action == ' a') {
        result[post.id] = responses_a
      } else if (action == ' s') {
        result[post.id] = responses_s
      }
    }
    catch (e) {
      console.error(e)
      result[post.id] = responses_all
    }
  }));
  res.status(200).json(result)

}
