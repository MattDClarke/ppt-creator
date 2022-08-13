import Image from 'next/image';
import { PAGE_SIZE } from 'appConstants';
import { useUnsplashAPI } from 'hooks/useUnsplashAPI';
import * as Styles from './ImgSearch.styles';
import { useCallback, useRef } from 'react';
import { useMountedState } from 'hooks/useMountedState';
import Loader from './Loader';
import { Dispatch, State } from './PptCreate.types';

type Props = {
  word: string;
  index: number;
  state: State;
  dispatch: Dispatch;
};

export default function PptCreateImgSearch({
  word,
  index,
  state,
  dispatch,
}: Props) {
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

  function handleImgClick(e: React.MouseEvent<HTMLDivElement>) {
    handleImgSelect(e.currentTarget);
  }

  function handleImgKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.code === 'Enter') handleImgSelect(e.currentTarget);
  }

  function handleImgSelect(currTarget: HTMLDivElement) {
    const img = currTarget.getAttribute('data-image-src-regular') as string;
    const originalImgWidth = parseInt(
      currTarget.getAttribute('data-original-width') as string
    );
    const originalImgHeight = parseInt(
      currTarget.getAttribute('data-original-height') as string
    );
    const triggerDownloadAPI = currTarget.getAttribute(
      'data-trigger-download-api'
    ) as string;
    dispatch({
      type: 'Add_Img_Unsplash',
      step: index,
      img,
      originalImgHeight,
      originalImgWidth,
      triggerDownloadAPI,
    });
  }

  // for adding style to selected image
  function urlInStateCheck(url: string) {
    return state?.selectedImgs[index]?.img === url;
  }

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
          <div
            key={photo?.id}
            className={Styles.ImgsCardCSS.className}
            tabIndex={0}
            onClick={handleImgClick}
            onKeyDown={handleImgKeyDown}
            data-image-src-regular={photo?.urls?.regular}
            data-original-width={photo?.width}
            data-original-height={photo?.height}
            data-trigger-download-api={photo?.links?.download_location}
          >
            {/* if it is the last pic, lastPicElementRef will be called with this div as a reference */}
            {photos.length === i + 1 ? (
              <div
                className={Styles.ImgsCardImgContainerCSS.className}
                style={{
                  outline: urlInStateCheck(photo?.urls?.regular)
                    ? '3px solid black'
                    : 'none',
                }}
                ref={lastPicElementRef}
              >
                <Image
                  src={photo?.urls?.thumb}
                  alt={photo?.alt_description}
                  layout="fill"
                  objectFit="contain"
                  style={{
                    filter: urlInStateCheck(photo?.urls?.regular)
                      ? 'sepia(0.5)'
                      : 'none',
                  }}
                />
              </div>
            ) : (
              <div
                className={Styles.ImgsCardImgContainerCSS.className}
                style={{
                  outline: urlInStateCheck(photo?.urls?.regular)
                    ? '3px solid black'
                    : 'none',
                }}
              >
                <Image
                  src={photo?.urls?.thumb}
                  alt={photo?.alt_description}
                  layout="fill"
                  objectFit="contain"
                  style={{
                    filter: urlInStateCheck(photo?.urls?.regular)
                      ? 'sepia(0.5)'
                      : 'none',
                  }}
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
