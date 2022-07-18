import Image from 'next/image';
import { PAGE_SIZE } from 'appConstants';
import { useUnsplashAPI } from 'hooks/useUnsplashAPI';
import * as Styles from './ImgSearch.styles';
import { useCallback, useRef } from 'react';
import { useMountedState } from 'hooks/useMountedState';
import Loader from './Loader';

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

  // infinite scrolling
  const isMounted = useMountedState();
  const observer = useRef<IntersectionObserver | null>(null);

  // called when last pic (in set of 10) div created, it will call this useCallback
  const lastPicElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingInitialData || isLoadingMore) return;
      // disconnect from old last element, so you can have new last element
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        // there is only one div that is set as the ref.current value
        if (entries[0].isIntersecting && !pageEndReached) {
          // trigger another API call -> 10 more pics
          // if error or rate limit reached -> no more images will be shown
          if (isMounted() && !error) {
            setSize(prevSize => prevSize + 1);
          }
        }
      });

      // prevent node being observed right away, else intersection may occur on pageload
      setTimeout(() => {
        if (node) observer?.current?.observe(node);
      }, 200);
    },
    [
      isMounted,
      error,
      isLoadingInitialData,
      isLoadingMore,
      pageEndReached,
      setSize,
    ]
  );

  return (
    <div>
      {isEmpty &&
        !isLoadingInitialData &&
        pageEndReached &&
        totalPhotos === 0 &&
        data && <p>No photos found</p>}
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
        {photos.map((photo, i) => (
          <div key={photo?.id} className={Styles.ImgsCardCSS.className}>
            {/* if it is the last pic, lastPicElementRef will be called with this div as a reference */}
            {photos.length === i + 1 ? (
              <div
                className={Styles.ImgsCardImgContainerCSS.className}
                ref={lastPicElementRef}
              >
                <Image
                  src={photo?.urls?.thumb}
                  alt={photo?.alt_description}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <div className={Styles.ImgsCardImgContainerCSS.className}>
                <Image
                  src={photo?.urls?.thumb}
                  alt={photo?.alt_description}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
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
      {isEmpty && !data && (
        <Loader circleDiameter={20} colorDark="#64c9ff" colorLight="#cdeeff" />
      )}
    </div>
  );
}
