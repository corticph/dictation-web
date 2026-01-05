import { css } from "lit";
import { LabelStyles } from "./component-styles.js";

const ModeSelectorStyles = [
  LabelStyles,
  css`
  :host {
    display: block;
  }
  .mode-selector-tabs {
    display: flex;
    background: var(--muted-background, light-dark(#fafafa, #2a2a2a));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
    padding: 0;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-wrap: nowrap;
    gap: 2px;
  }
  .mode-selector-tab {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid transparent;
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
    border-radius: var(--card-inner-border-radius, 6px);
    margin: -1px;
  }
  .mode-selector-tab:hover:not(:disabled) {
    background: var(--action-plain-background-hover, light-dark(#ddd, #444));
  }
  .mode-selector-tab.active {
    background: var(--card-background, light-dark(#fff, #333));
    border-color: var(--card-border-color, light-dark(#ddd, #555));
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
  }
  .mode-selector-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,
];

export default ModeSelectorStyles;
