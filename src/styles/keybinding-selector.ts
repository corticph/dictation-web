import { css } from "lit";

const KeybindingSelectorStyles = css`
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
  .keybinding-selector-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 36px;
    padding: 4px 8px 4px 8px;
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-inner-border-radius, 6px);
  }
  .keybinding-selector-wrapper:focus-within {
    border-color: var(--action-accent-background, light-dark(#007bff, #0056b3));
    outline: 2px solid var(--action-accent-background, light-dark(#007bff, #0056b3));
  }
  .keybinding-selector-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
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
    width: 24px;
    height: 24px;
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: 4px;
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
    font-size: 16px;
    line-height: 28px;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
    text-align: center;
    flex-shrink: 0;
  }
  .keybinding-clear {
    margin-left: auto;
    padding: 0;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    font-size: 18px;
    line-height: 1;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .keybinding-clear:hover:not(:disabled) {
    opacity: 1;
  }
  .keybinding-clear:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .keybinding-help {
    font-size: 12px;
    line-height: 20px;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
    margin: 0;
    letter-spacing: 0.01px;
  }
`;

export default KeybindingSelectorStyles;
