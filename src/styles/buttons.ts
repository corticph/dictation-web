import { css } from 'lit';

const ButtonStyles = css`
  /* Default (plain) button styling */
  button {
    background: var(--action-plain-background);
    /* border: 1px solid var(--action-plain-border-color); */
    border: none;
    color: var(--component-text-color);
    cursor: pointer;
    padding: 8px;
    border-radius: var(--card-inner-border-radius);
    display: inline-flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    font-family: var(--component-font-family);
  }

  button:hover {
    background: var(--action-plain-background-hover);
  }

  button:focus-visible {
    outline: 2px solid var(--action-accent-background);
    outline-offset: 2px;
  }

  /* Accent variant */
  button.accent {
    background: var(--action-accent-background);
    color: var(--action-accent-text-color);
    border: none;
  }

  button.accent:hover {
    background: var(--action-accent-background-hover);
  }

  /* Red variant */
  button.red {
    background: var(--action-red-background);
    color: var(--action-red-text-color);
    border: none;
  }

  button.red:hover {
    background: var(--action-red-background-hover);
  }
`;

export default ButtonStyles;
