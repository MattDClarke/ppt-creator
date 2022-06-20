import css from 'styled-jsx/css';

export default css.global`
  * {
    box-sizing: border-box;
  }
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  .layout-container {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 35px 2rem 1.45rem;
    overflow-x: hidden;
  }

  main {
    padding: 2rem 0;
  }

  h1 {
    font-weight: 700;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  footer {
    text-align: center;
  }
`;
