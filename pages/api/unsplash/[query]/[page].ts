import type { NextApiRequest, NextApiResponse } from 'next';
import { createApi } from 'unsplash-js';

export default async function getPhotos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const perPage = 10;
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string, 10) as number;

    const accessToken = process.env.UNSPLASH_ACCESS_TOKEN as string;
    const api = createApi({
      accessKey: accessToken,
    });
    await api.search
      .getPhotos({
        query,
        page,
        perPage,
      })
      .then(result => {
        if (result.errors) {
          // normally only 1 error - according to Unsplash docs. Array of strings
          res.status(400).json({ message: result.errors[0] });
        } else {
          const feed = result.response;
          // extract total and results array from response
          const total = feed.total;
          const results = feed.results;
          res.json({ total, results, message: 'success' });
        }
      })
      // if internet connection issue
      .catch(() => {
        res.status(500).json({ message: 'Internet connection error' });
        return;
      });
    return;
  }
  res.status(405).json({
    message: 'Method not allowed',
  });
}
