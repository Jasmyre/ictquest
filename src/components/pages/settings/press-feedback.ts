/**
 * Shared press-feedback classes for the settings surface.
 *
 * Buttons shrink to 0.97 and grouped rows to 0.98 while pressed; both
 * keep `cursor-pointer` so affordance matches the rest of the app.
 */
export const SETTINGS_BUTTON_PRESS_CLASS =
  "cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]";

export const SETTINGS_ROW_PRESS_CLASS =
  "cursor-pointer transition-transform duration-150 ease-out active:scale-[0.98]";
