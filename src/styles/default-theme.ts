import { css } from "lit";

const DefaultThemeStyles = css`
  :host {
    color-scheme: light dark;
    /* Component Defaults */
    --component-font-family:
      -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui,
      helvetica neue, Cantarell, Ubuntu, roboto, noto, helvetica, arial,
      sans-serif;
    --component-text-color: light-dark(#333, #eee);

    /* Card Defaults */
    --card-background: light-dark(#fff, #333);
    --card-border-color: light-dark(#ddd, #555);
    --card-padding: 4px;
    --card-border-radius: 8px;
    --card-inner-border-radius: 6px;
    --card-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    /* Actions Defaults */
    --action-plain-border-color: light-dark(#ccc, #555);
    --action-plain-background-hover: light-dark(#ddd, #444);

    --action-accent-background: light-dark(#007bff, #0056b3);
    --action-accent-background-hover: light-dark(#0056b3, #003d80);
    --action-accent-text-color: #fff;

    --action-red-background: light-dark(#dc3545, #bd2130);
    --action-red-background-hover: light-dark(#bd2130, #a71c24);
    --action-red-text-color: #fff;

    /* Callout Defaults */
    --callout-info-background: light-dark(#007bff33, #0056b333);
    --callout-info-border: light-dark(#007bff99, #0056b399);
    --callout-info-text: light-dark(#007bff, #0056b3);

    --callout-error-background: light-dark(#dc354533, #bd213033);
    --callout-error-border: light-dark(#dc354599, #bd213099);
    --callout-error-text: light-dark(#dc3545, #bd2130);

    --callout-warn-background: light-dark(#fd7e1433, #e06c1233);
    --callout-warn-border: light-dark(#fd7e1499, #e06c1299);
    --callout-warn-text: light-dark(#fd7e14, #e06c12);

    /* Visualiser Defaults */
    --visualiser-background: light-dark(#e0e0e0, #fff);
  }

  :host {
    box-sizing: border-box;
    font-family: var(--component-font-family);
    color: var(--component-text-color);
  }
`;

export default DefaultThemeStyles;
