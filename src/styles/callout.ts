import { css } from 'lit';

const CalloutStyles = css`
  .callout {
    background: var(--callout-info-background);
    border: 1px solid var(--callout-info-border);
    color: var(--callout-info-text);
    padding: 8px;
    border-radius: var(--card-inner-border-radius);
    display: flex;
    font-size: 0.9rem;
    gap: 8px;
    align-items: center;
    max-width: 100%;
    height: fit-content;
    &.warn {
      background: var(--callout-warn-background);
      border: 1px solid var(--callout-warn-border);
      color: var(--callout-warn-text);
    }
  }
`;

export default CalloutStyles;
