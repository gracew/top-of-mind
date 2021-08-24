// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors()

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
  req.body.forEach((post: any) => {
    result[post.id] = [
      "Congratulations! Best of luck.",
      "Great to hear!",
      "This is amazing. Congrats!",
      "So happy to hear. Congratulations!!",
      "This is wonderful news.",
      "I'm so proud of you. No one deserves this more.",
      "Very interesting. Thank you for sharing.",
      "I learned something new today!",
      "Thank you for taking the time to share this.",
      "A very thought-provoking post.",
      "This was a fascinating read.",
      "Great thought leadership.",
      "Happy to share this with my network.",
      "Let me know how I can help amplify.",
      "I can share with my network if you'd like.",
      "Do you need help signal-boosting?",
      "I'm happy to make intros that would be helpful.",
      "I'll be on the lookout for you.",
    ]
  })
  res.status(200).json(result);
}
