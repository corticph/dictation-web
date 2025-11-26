import { css } from 'lit';

const ComponentStyles = css`
  .wrapper {
    background-color: var(--card-background);
    border: 1px solid var(--card-border-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    padding: var(--card-padding);
    display: flex;
    gap: 4px;
    height: 46px;
    width: fit-content;
    box-sizing: border-box;
    overflow: hidden;
  }
`;

export default ComponentStyles;

