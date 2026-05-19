import { css } from "lit";

const AmbientVirtualModeSelectorStyles = css`
  :host {
    display: block;
  }

  .virtual-mode-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }

  .virtual-mode-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1 1 auto;
    min-width: 0;
  }

  .virtual-mode-header {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
    color: var(--component-text-color, light-dark(#333, #eee));
  }

  .virtual-mode-header icon-headset {
    display: inline-flex;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    transform: translateY(-1px);
  }

  .virtual-mode-title {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1;
    color: var(--component-text-color, light-dark(#333, #eee));
  }

  .virtual-mode-description {
    font-size: 12px;
    line-height: 1.45;
    color: var(--component-text-color, light-dark(#333, #eee));
    opacity: 0.6;
  }

  .switch {
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    width: 36px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 9999px;
    background: var(--card-border-color, light-dark(#ddd, #555));
    border: none;
    cursor: pointer;
    padding: 2px;
    transition: background-color 0.15s ease;
    margin: 0;
  }

  .switch:checked {
    background: var(--action-accent-background, light-dark(#007bff, #0056b3));
  }

  .switch::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: var(--card-background, light-dark(#fff, #fff));
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease;
  }

  .switch:checked::before {
    transform: translateX(16px);
  }

  .switch:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .switch:focus-visible {
    outline: 2px solid var(--action-accent-background, light-dark(#007bff, #0056b3));
    outline-offset: 2px;
  }
`;

export default AmbientVirtualModeSelectorStyles;
