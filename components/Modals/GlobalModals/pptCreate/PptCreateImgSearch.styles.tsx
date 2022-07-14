import css from 'styled-jsx/css';

export const ImgsContainerCSS = css.resolve`
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const ImgsCardCSS = css.resolve`
  div {
    display: grid;
    grid-template-rows: 1fr 40px;
    margin: 0.5rem;
    animation: expand 0.3s ease-in;
  }
  @keyframes expand {
    from {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }
`;

export const ImgsCardImgContainerCSS = css.resolve`
  div {
    position: relative;
    height: 200px;
    width: 200px;
    border: #909090 solid 1px;
  }

  div span {
    position: unset !important;
    height: 100px;
  }
`;

export const ImgsCardCaptionCSS = css.resolve`
  div {
    padding: 0.25rem;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.7rem;
    background-color: #ebebef;
    outline: #909090 solid 1px;
  }

  div a {
    white-space: nowrap;
  }
`;
