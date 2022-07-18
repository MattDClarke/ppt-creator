type Props = {
  circleDiameter: number;
  colorDark: string;
  colorLight: string;
};

export default function Loader({
  circleDiameter,
  colorDark,
  colorLight,
}: Props) {
  return (
    <div className="loader">
      <div className="dot-flashing"></div>
      <style jsx>{`
        .loader {
          width: 100%;
          padding: 1rem;
        }

        .dot-flashing {
          margin: 0 auto;
          position: relative;
          width: ${circleDiameter}px;
          height: ${circleDiameter}px;
          border-radius: 50%;
          background-color: ${colorDark};
          color: ${colorDark};
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }

        .dot-flashing::before,
        .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }

        .dot-flashing::before {
          left: ${-circleDiameter * 1.5}px;
          width: ${circleDiameter}px;
          height: ${circleDiameter}px;
          border-radius: 50%;
          background-color: ${colorDark};
          color: ${colorDark};
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 0s;
        }

        .dot-flashing::after {
          left: ${+circleDiameter * 1.5}px;
          width: ${circleDiameter}px;
          height: ${circleDiameter}px;
          border-radius: 50%;
          background-color: ${colorDark};
          color: ${colorDark};
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 1s;
        }

        @keyframes dotFlashing {
          0% {
            background-color: ${colorDark};
          }
          50%,
          100% {
            background-color: ${colorLight};
          }
        }
      `}</style>
    </div>
  );
}
