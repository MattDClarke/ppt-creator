// from - https://stackblitz.com/edit/unsplash-js-typescript?file=index.tsx
// types not complete - just properties that I will use

export type Photo = {
  id: number;
  width: number;
  height: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    username: string;
    name: string;
  };
  links: {
    html: string;
    download_location: string;
  };
};

export type UnsplashReturn = {
  total: number;
  results: Photo[];
};
