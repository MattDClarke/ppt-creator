import Image from 'next/image';
import { PAGE_SIZE } from 'appConstants';
import { useUnsplashAPI } from 'hooks/useUnsplashAPI';
import * as Styles from './PptCreateImgSearch.styles';

type Props = {
  word: string;
};

export default function PptCreateImgSearch({ word }: Props) {
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
    <div>
      {isEmpty && <p>No photos found</p>}
      {!isEmpty && (
        <p>
          Images from{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#04a7fb' }}
          >
            Unsplash
          </a>
        </p>
      )}
      <div className={Styles.ImgsContainerCSS.className}>
        {photos.map(photo => (
          <div key={photo?.id} className={Styles.ImgsCardCSS.className}>
            <div className={Styles.ImgsCardImgContainerCSS.className}>
              <Image
                src={photo?.urls?.thumb}
                alt={photo?.alt_description}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className={Styles.ImgsCardCaptionCSS.className}>
              <div>Photo by</div>
              <a
                href={photo?.links?.html}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#04a7fb' }}
              >
                {photo?.user?.name}
              </a>
            </div>
          </div>
        ))}
        {Styles.ImgsContainerCSS.styles}
        {Styles.ImgsCardCSS.styles}
        {Styles.ImgsCardImgContainerCSS.styles}
        {Styles.ImgsCardCaptionCSS.styles}
      </div>
      {!isEmpty && (
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
      )}
    </div>
  );
}
