import { getPlatform } from './utils-xplat';

/**
 * Returns true if
 * - the control key was pressed on a non-mac platform
 * - the cmd key is pressed on macOS
 */
export const isCtrlKey = (e: React.KeyboardEvent | React.MouseEvent | KeyboardEvent): boolean => {
  const isMacOS = getPlatform() === 'darwin';

  return (isMacOS && e.metaKey) || (!isMacOS && e.ctrlKey);
};

export const isAltKey = (e: React.KeyboardEvent | React.MouseEvent | KeyboardEvent): boolean => {
  const isMacOS = getPlatform() === 'darwin';

  return (isMacOS && e.ctrlKey) || (!isMacOS && e.metaKey);
};
