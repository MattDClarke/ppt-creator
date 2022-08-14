import type { selectedImg } from '../components/Modals/GlobalModals/pptCreate/PptCreate.types';

const handleErrors = (response: Response) => {
  // HTTP response status not ok - offline, network error (DNS lookup failure...)
  if (!response.ok) {
    // custom error
    throw Error(response.statusText);
  }
  return response;
};

const toDataURL = (url: string) =>
  fetch(url)
    .then(handleErrors)
    // convert url to a chunk of data
    .then(response => response.blob())
    .catch(error => console.error(error))
    .then(
      blob =>
        // promise represents O / X of async and its resulting value
        new Promise<string>((resolve, reject) => {
          // reads data from a blob
          const reader = new FileReader();

          if (blob instanceof Blob) {
            // convert blob to base64 img
            reader.readAsDataURL(blob);
            reader.onloadend = () =>
              typeof reader.result === 'string'
                ? resolve(reader.result)
                : reject('Unexpected type received from FileReader');
            reader.onerror = error => reject(error);
          } else {
            throw new Error('blob conversion failed');
          }
        })
    )
    .catch(error => console.error(error));

export async function imagesSrcToDataURL(selectedImgs: selectedImg[]) {
  // pre-encode any urls to base64 strings
  // to make creating ppt faster - PptxGenJS docs: https://gitbrent.github.io/PptxGenJS/docs/api-images
  // map returns an array of promises
  const newSelectedImgs = selectedImgs.map(async imgObj => {
    // skip imgObj if img already base64 format (locally uploaded images)
    if (typeof imgObj.img === 'string') {
      let newUrl;
      if (imgObj.img.substring(0, 10) === 'data:image') {
        return imgObj;
      }

      newUrl = await toDataURL(imgObj.img)
        .then(dataUrl => (newUrl = dataUrl))
        .catch(error => console.error(error));

      if (newUrl === undefined) {
        throw Error('base64 conversion error');
      }

      return {
        ...imgObj,
        img: newUrl,
      };
    } else {
      return imgObj;
    }
  });

  const result = await Promise.all(newSelectedImgs);
  return result;
}
