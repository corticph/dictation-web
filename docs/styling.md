# Styling the Corti Dictation Web Component

The **Corti Dictation Web Component** provides various CSS variables for customization. You can override these variables to match your design system.

## Overriding Dark/Light Theme
By default, the UI uses the system color-scheme (dark or light). This may not suit your application though, so you can force either dark or light using the `color-scheme` CSS property. For example, the styles below will force light mode.

```css
corti-dictation {
    color-scheme: light;
}
```

## Direct CSS Properties

Some CSS properties can be set directly on the `corti-dictation` component and will affect the component's `:host` element, similar to how `color-scheme` works. These include inherited properties that affect the host:

```css
corti-dictation {
    color-scheme: light;
    font-family: 'Arial', sans-serif;  /* Affects :host font-family */
    font-size: 14px;                    /* Affects :host font-size */
    color: #333;                        /* Affects :host color */
}
```

**Note:** While these properties can be set directly, the component primarily uses CSS custom properties (documented below) for styling, which provides more control and is the recommended approach.

## Using CSS Variables
For more control in customization of the UI component, you can redefine the variables inside a global CSS file or within a `<style>` tag. Note, the following CSS variables may change over time.

```css
corti-dictation {
  --component-font-family: 'Arial', sans-serif;
  --component-text-color: #222;
  --card-background: #f9f9f9;
  --action-accent-background: #ff6600;
}
```

## Available Styling Variables

### Component Defaults
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--component-font-family` | `-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif` | The font family used in the component. |
| `--component-text-color` | `#333` | Text color for the component. |

### Card Styling
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--card-background` | `#fff` | Background color of the component's card. |
| `--card-border-color` | `#ddd` | Border color of the card. |
| `--card-padding` | `4px` | Padding inside the card. |
| `--card-border-radius` | `8px` | Outer border radius of the card. |
| `--card-inner-border-radius` | `6px` | Inner border radius of the card. |
| `--card-box-shadow` | `0 2px 5px rgba(0, 0, 0, 0.1)` | Shadow effect for the card. |

### Action Buttons
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--action-plain-background` | `transparent` | Background color for plain action buttons. |
| `--action-plain-background-hover` | `#ddd` | Background color when hovering over plain action buttons. |
| `--action-accent-background` | `#007bff` | Background color for primary action buttons. |
| `--action-accent-background-hover` | `#0056b3` | Hover background color for primary action buttons. |
| `--action-accent-text-color` | `#fff` | Text color for primary action buttons. |
| `--action-red-background` | `#dc3545` | Background color for recording active action buttons. |
| `--action-red-background-hover` | `#bd2130` | Hover background color for recording active action buttons. |
| `--action-red-text-color` | `#fff` | Text color for recording active action buttons. |

## Customizing with Shadow DOM 

**Important:** Due to Shadow DOM encapsulation, you **cannot** use CSS selectors like `corti-dictation button` from outside the component. Shadow DOM prevents external styles from penetrating into the component's internal structure. The component does not expose CSS parts (`part` attributes), so `::part()` selectors are not available.

If you need to style internal elements beyond what CSS custom properties allow, you must access the Shadow DOM directly. Element IDs and internal structure can change at any time though, so you should only consider this in very specific situations. If you need to access nested elements, you'll need to traverse multiple shadow roots:

```js
// Accessing nested shadow DOM (not recommended - structure may change)
const dictation = document.querySelector('corti-dictation');
const root = dictation.shadowRoot.querySelector('dictation-root');
const button = root.shadowRoot.querySelector('dictation-recording-button');
const actualButton = button.shadowRoot.querySelector('button');

actualButton.style.color = "red";
```

**Note:** This approach is fragile and not recommended. Element IDs and internal structure are implementation details that may change between versions.

## Using Individual Components

If you use the individual Dictation components (like `dictation-recording-button`, `dictation-settings-menu`, `dictation-device-selector`, `dictation-language-selector`) directly instead of the `corti-dictation` wrapper, you can still set CSS properties directly on them (similar to `color-scheme`), and use CSS custom properties. However, you cannot use CSS selectors like `dictation-recording-button button` because these components also use Shadow DOM.

```css
/* These work - direct properties on the component */
dictation-recording-button {
    color-scheme: light;
    font-family: 'Arial', sans-serif;
}

/* These work - CSS custom properties */
dictation-recording-button {
    --action-accent-background: #ff6600;
    --card-border-radius: 12px;
}

/* These DON'T work - Shadow DOM prevents selectors from penetrating */
dictation-recording-button button {
  background-color: #ff6600;  /* Won't work */
}
```

For further customization, consider using the component's events and JavaScript APIs to build your own UI, or use the CSS custom properties documented above.
