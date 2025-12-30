import { css } from "lit";

const ModeSelectorStyles = css`
  :host {
    display: block;
  }
  label {
    display: block;
    font-size: 0.8rem;
    padding-bottom: 0.5rem;
    font-weight: 500;
    color: var(--component-text-color, light-dark(#333, #eee));
    pointer-events: none;
  }
  .mode-selector-tabs {
    display: flex;
    background: var(--muted-background, light-dark(#fafafa, #2a2a2a));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
    padding: 0;
    overflow: hidden;
    height: 32px;
    align-items: center;
    justify-content: center;
  }
  .mode-selector-tab {
    flex: 1;
    padding: 10px 12px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    color: var(--component-text-color, light-dark(#333, #eee));
    cursor: pointer;
    transition: all 0.2s;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mode-selector-tab:hover:not(:disabled) {
    background: var(--action-plain-background-hover, light-dark(#ddd, #444));
  }
  .mode-selector-tab.active {
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
  }
  .mode-selector-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ModeSelectorStyles;
