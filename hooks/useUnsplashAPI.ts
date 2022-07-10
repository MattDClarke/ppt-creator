import useSWRInfinite from 'swr/infinite';
import { UnsplashReturn } from 'types/unsplash.types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useUnsplashAPI(query: string) {
  const { data, error, size, setSize } = useSWRInfinite<UnsplashReturn, Error>(
    index => `/api/unsplash/${query}/${index + 1}`,
    fetcher,
    // disable revalidation - https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    }
  );
  return { data, error, size, setSize };
}

export { useUnsplashAPI };
