import { css } from 'lit';

const CalloutStyles = css`
  .callout {
    background: var(--callout-info-background, light-dark(#007bff33, #0056b333));
    border: 1px solid var(--callout-info-border, light-dark(#007bff99, #0056b399));
    color: var(--callout-info-text, light-dark(#007bff, #0056b3));
    padding: 8px;
    border-radius: var(--card-inner-border-radius, 6px);
    display: flex;
    font-size: 0.9rem;
    gap: 8px;
    align-items: center;
    max-width: 100%;
    height: fit-content;
    &.warn {
      background: var(--callout-warn-background, light-dark(#fd7e1433, #e06c1233));
      border: 1px solid var(--callout-warn-border, light-dark(#fd7e1499, #e06c1299));
      color: var(--callout-warn-text, light-dark(#fd7e14, #e06c12));
    }
  }
`;

export default CalloutStyles;
