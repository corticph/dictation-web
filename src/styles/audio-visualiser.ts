import { css } from "lit";

const AudioVisualiserStyles = css`
  :host {
    height: 100%;
  }

  .container {
    display: flex;
    width: 8px;
    flex-direction: column-reverse; /* Bottom-up stacking */
    height: 100%;
    gap: 1px;
    opacity: 0.5;

    &.active {
      opacity: 1;
    }
  }

  .segment {
    flex: 1;
    background-color: var(--action-accent-text-color, light-dark(#fff, #fff));
    transition: background-color 0.25s;
    border-radius: 1px;
    opacity: 0.5;
  }

  .segment.active {
    opacity: 1;
  }
`;

export default AudioVisualiserStyles;

