import { css } from "lit";
import { LabelStyles } from "./component-styles.js";

const SelectStyles = [
  LabelStyles,
  css`
  select {
    background: var(--card-background, light-dark(#fff, #333));
    color: var(--component-text-color, light-dark(#333, #eee));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    padding: var(--card-padding, 4px);
    border-radius: var(--card-inner-border-radius, 6px);
    outline: none;
    width: 100%;
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  select:hover {
    background: var(--action-plain-background-hover, light-dark(#ddd, #444));
  }

  select:focus-visible {
    outline: 2px solid var(--action-accent-background, light-dark(#007bff, #0056b3));
    /* outline-offset: 2px; */
  }
`,
];

export default SelectStyles;
