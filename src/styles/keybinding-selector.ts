import { css } from "lit";
import { LabelStyles } from "./component-styles.js";

const KeybindingSelectorStyles = [
  LabelStyles,
  css`
  :host {
    display: block;
  }
  .keybinding-selector-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: var(--card-padding, 4px) 8px;
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
    overflow: hidden;
  }
  .keybinding-selector-wrapper:focus-within {
    border-color: var(--action-accent-background, light-dark(#007bff, #0056b3));
    outline: 2px solid var(--action-accent-background, light-dark(#007bff, #0056b3));
  }
  .keybinding-selector-input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    line-height: 24px;
    color: var(--component-text-color, light-dark(#333, #eee));
    outline: none;
    padding: 0;
    cursor: text;
  }
  .keybinding-selector-input::placeholder {
    opacity: 0.6;
    color: var(--component-text-color, light-dark(#333, #eee));
  }
  .keybinding-selector-input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .keybinding-key {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    height: 24px;
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
    font-size: 14px;
    line-height: 24px;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
    text-align: center;
    flex-shrink: 0;
  }
  .keybinding-help {
    font-size: 12px;
    line-height: 20px;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
    margin: 0;
    letter-spacing: 0.01px;
  }
  .settings-group {
    background: var(--card-background, light-dark(#fafafa, #2a2a2a));
    padding: 12px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`,
];

export default KeybindingSelectorStyles;
