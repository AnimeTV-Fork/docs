# D-Pad Navigation Engine

Since AnimeTV runs primarily on Android TV and Google TV, the entire user interface must be completely operable using a standard hardware remote control (D-Pad).

## Focus Management

Web browsers and standard WebViews do not have built-in spatial D-Pad navigation that maps naturally to TV interfaces. AnimeTV uses a custom spatial focus engine.

### Core Key Handlers

Keyboard remote events are intercepted at the window level:

```javascript
window.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 19:  // Up
    case 38:
      navigate('up');
      break;
    case 20:  // Down
    case 40:
      navigate('down');
      break;
    case 21:  // Left
    case 37:
      navigate('left');
      break;
    case 22:  // Right
    case 39:
      navigate('right');
      break;
    case 23:  // Center / OK
    case 13:
      triggerClick(currentFocusElement);
      break;
    case 4:   // Back
      handleBackPress();
      break;
  }
});
```

### Focusable Elements

Only elements explicitly containing the `.focusable` class will capture focus. When an element is focused, it receives the `.focused` helper class:

```css
/* Custom focus visual state matching AnimeTV branding */
.focusable {
  border: 2px solid transparent;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.focusable.focused {
  border-color: var(--vp-c-brand-1);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
}
```

### Spatial Grid Algorithm

The navigation engine calculates Euclidean distance between the center coordinates of the current focused element and all other visible `.focusable` elements in the viewport to determine the best candidate.

$$\text{Distance} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

This calculation is directional, filtering out elements that do not align with the requested cardinal direction (e.g. if navigating 'right', candidates must have $x_2 > x_1$).