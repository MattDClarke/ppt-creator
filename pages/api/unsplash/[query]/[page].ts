import type { NextApiRequest, NextApiResponse } from 'next';
import { createApi } from 'unsplash-js';

// from demo - https://stackblitz.com/edit/unsplash-js-typescript?file=index.tsx
type Photo = {
  id: number;
  width: number;
  height: number;
  urls: {
    large: string;
    regular: string;
    raw: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  links: {
    html: string;
    download_location: string;
  };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

type filteredPhoto = {
  id: number;
  width: number;
  height: number;
  url_thumb: string;
  url_regular: string;
  alt_description: string;
  username: string;
  profile: string;
  trigger_download_API: string;
};

type Data = {
  message: string;
  total?: number;
  filteredResults?: filteredPhoto[];
};

export default function getPhotos(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const perPage = 10;
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string, 10) as number;

    const accessToken = process.env.UNSPLASH_ACCESS_TOKEN as string;
    const api = createApi({
      accessKey: accessToken,
    });

    api.search
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
          const { total } = feed;
          const results = feed.results as Photo[];
          // filter feed - dnt need all the info.
          const filteredResults = results.map(pic => ({
            id: pic.id,
            width: pic.width,
            height: pic.height,
            url_thumb: pic.urls.thumb,
            url_regular: pic.urls.regular,
            alt_description: pic.alt_description,
            username: pic.user.name,
            profile: pic.links.html,
            trigger_download_API: pic.links.download_location,
          }));
          res.json({ total, filteredResults, message: 'success' });
        }
      })
      // if internet connection issue
      .catch(() => {
        res.status(500).json({ message: 'Internet connection error' });
      });
    return;
  }
  res.status(405).json({
    message: 'Method not allowed',
  });
}
