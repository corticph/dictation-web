import { css } from "lit";

const SelectStyles = css`
  label {
    display: block;
    font-size: 0.8rem;
    padding-bottom: 0.5rem;
    font-weight: 500;
    color: var(--component-text-color);
    pointer-events: none;
  }
  select {
    background: var(--card-background);
    color: var(--component-text-color);
    border: 1px solid var(--card-border-color);
    padding: var(--card-padding);
    border-radius: var(--card-inner-border-radius);
    outline: none;
    width: 100%;
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  select:hover {
    background: var(--action-plain-background-hover);
  }

  select:focus-visible {
    outline: 2px solid var(--action-accent-background);
    /* outline-offset: 2px; */
  }
`;

export default SelectStyles;
