import { css } from "lit";

const SettingsMenuStyles = css`
  :host {
    display: block;
  }
  /* Retain the anchor-name styling for this component */
  #settings-popover-button {
    anchor-name: --settings_popover_btn;
  }
  [popover] {
    margin: 0;
    padding: 16px;
    background: var(--card-background, light-dark(#fff, #333));
    border: 1px solid var(--card-border-color, light-dark(#ddd, #555));
    border-radius: var(--card-border-radius, 8px);
    box-shadow: var(--card-box-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
    z-index: 1000;
    max-width: 260px;
    width: 100%;
    min-width: 200px;
    position-anchor: --settings_popover_btn;
    position-area: bottom span-right;
    position-visibility: always;
    position-try-fallbacks: flip-inline;
    overflow-x: hidden;
  }
  .settings-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .settings-group {
    background: var(--muted-background, light-dark(#fafafa, #2a2a2a));
    padding: 12px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export default SettingsMenuStyles;
