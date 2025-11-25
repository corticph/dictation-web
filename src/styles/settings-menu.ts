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
    background: var(--card-background);
    border: 1px solid var(--card-border-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
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
    gap: 20px;
  }
`;

export default SettingsMenuStyles;
