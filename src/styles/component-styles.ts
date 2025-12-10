import { css } from "lit";

const ComponentStyles = css`
  :host {
    font-family: var(--component-font-family, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif);
  }

  .wrapper {
    background-color: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-border-radius, 8px);
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
    padding: var(--card-padding, 4px);
    display: flex;
    gap: 4px;
    height: 46px;
    width: fit-content;
    box-sizing: border-box;
    overflow: hidden;
  }
`;

export default ComponentStyles;
