import { css } from 'lit';

const ButtonStyles = css`
  /* Default (plain) button styling */
  button {
    background: var(--action-plain-background, transparent);
    /* border: 1px solid var(--action-plain-border-color); */
    border: none;
    color: var(--component-text-color, light-dark(#333, #eee));
    cursor: pointer;
    padding: 8px;
    border-radius: var(--card-inner-border-radius, 6px);
    display: inline-flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    font-family: var(--component-font-family, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif);
  }

  button:hover {
    background: var(--action-plain-background-hover, light-dark(#ddd, #444));
  }

  button:focus-visible {
    outline: 2px solid var(--action-accent-background, light-dark(#007bff, #0056b3));
    outline-offset: 2px;
  }

  /* Accent variant */
  button.accent {
    background: var(--action-accent-background, light-dark(#007bff, #0056b3));
    color: var(--action-accent-text-color, #fff);
    border: none;
  }

  button.accent:hover {
    background: var(--action-accent-background-hover, light-dark(#0056b3, #003d80));
  }

  /* Red variant */
  button.red {
    background: var(--action-red-background, light-dark(#dc3545, #bd2130));
    color: var(--action-red-text-color, #fff);
    border: none;
  }

  button.red:hover {
    background: var(--action-red-background-hover, light-dark(#bd2130, #a71c24));
  }
`;

export default ButtonStyles;
