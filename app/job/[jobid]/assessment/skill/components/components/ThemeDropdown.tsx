"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../constants/customStyles";

const ThemeDropdown = ({ handleThemeChange, theme }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return (
    isMounted && (
      <Select
        id="ThemeDropdown"
        placeholder={`Select Theme`}
        // options={languageOptions}
        options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
          label: themeName,
          value: themeId,
          key: themeId,
        }))}
        value={theme}
        styles={customStyles}
        onChange={handleThemeChange}
      />
    )
  );
};

export default ThemeDropdown;
