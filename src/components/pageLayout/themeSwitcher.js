import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { MoonIcon, SunIcon } from '@patternfly/react-icons';

/**
 * @memberof PageLayout
 * @module ThemeSwitcher
 */

const DARK_THEME_CLASS = 'pf-v6-theme-dark';

/**
 * Render a light/dark theme toggle. Toggling "dark" adds the
 * `pf-v6-theme-dark` class to the root `<html>` element; toggling "light"
 * removes it.
 *
 * @param {object} props
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
const ThemeSwitcher = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains(DARK_THEME_CLASS)
  );

  const applyTheme = dark => {
    if (typeof document === 'undefined') {
      return;
    }
    const html = document.documentElement;
    if (dark) {
      html.classList.add(DARK_THEME_CLASS);
    } else {
      html.classList.remove(DARK_THEME_CLASS);
    }
    setIsDark(dark);
  };

  return (
    <ToggleGroup aria-label="Dark theme toggle group" className={className}>
      <ToggleGroupItem
        aria-label="light theme toggle"
        icon={<SunIcon />}
        buttonId="curiosity-theme-toggle-light"
        isSelected={!isDark}
        onChange={() => applyTheme(false)}
      />
      <ToggleGroupItem
        aria-label="dark theme toggle"
        icon={<MoonIcon />}
        buttonId="curiosity-theme-toggle-dark"
        isSelected={isDark}
        onChange={() => applyTheme(true)}
      />
    </ToggleGroup>
  );
};

export { ThemeSwitcher as default, ThemeSwitcher };
