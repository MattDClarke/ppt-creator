import nProgress from 'nprogress';

type Props = {
  numWords: number;
  step: number;
};

export default function LoadingBar({ numWords, step }: Props) {
  // -0.001 so that progress bar full on last step
  const percentComplete = step / (numWords + 1) - 0.001;
  nProgress.set(percentComplete);
  return (
    <style jsx global>{`
      /* Make clicks pass-through */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: #04a7fb;
        position: fixed;
        z-index: 111111111111;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }

      /* Fancy blur effect */
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #04a7fb, 0 0 5px #04a7fb;
        opacity: 1;

        transform: rotate(3deg) translate(0px, -4px);
      }

      .nprogress-custom-parent {
        overflow: hidden;
        position: relative;
      }

      .nprogress-custom-parent #nprogress .spinner,
      .nprogress-custom-parent #nprogress .bar {
        position: absolute;
      }

      @keyframes nprogress-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
}
