import Image from 'next/image';
import { PAGE_SIZE } from 'appConstants';
import { useUnsplashAPI } from 'hooks/useUnsplashAPI';

type Props = {
  word: string;
  step: number;
};

export default function PptCreateImgSearch({ word, step }: Props) {
  const { data, error, size, setSize } = useUnsplashAPI(word);
  const photos = data ? [...data.map(obj => obj?.results)].flat() : [];
  const totalPhotos = data ? data[0].total : 0;
  const isLoadingInitialData = !photos && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && photos && typeof photos[size - 1] === 'undefined');
  const isEmpty = photos?.length === 0;
  const pageEndReached = isEmpty || PAGE_SIZE * size + 1 > totalPhotos;

  return (
    <>
      <div>
        Query:{word}. Modal step: {step}
      </div>
      {isEmpty && <p>No photos found</p>}
      {photos.map(photo => (
        <div key={photo?.id}>
          <div
            style={{
              position: 'relative',
              margin: '6px 0',
              width: '200px',
              height: '100px',
            }}
          >
            <Image
              src={photo?.urls?.thumb}
              alt={photo?.alt_description}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div>Photo by {photo?.user?.name}</div>
        </div>
      ))}
      <button
        disabled={isLoadingMore || pageEndReached}
        onClick={() => setSize(size + 1)}
      >
        {isLoadingMore
          ? 'Loading...'
          : pageEndReached
          ? 'No more photos'
          : 'Load more photos'}
      </button>
    </>
  );
}
