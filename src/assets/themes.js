export const themes = {
  darkThemes: [
    {
      name: "Gruvbox Dark",
      color1: "#fbf1c7", // light0 - lightest (cream)
      color2: "#ebdbb2", // light1 - soft yellow
      color3: "#665c54", // dark3 - UI mid
      color4: "#3c3836", // dark1 - panel bg
      color5: "#1d2021"  // dark0_hard - base bg
    },
    {
      name: "Nord",
      color1: "#eceff4",
      color2: "#d8dee9",
      color3: "#4c566a",
      color4: "#3b4252",
      color5: "#2e3440"
    },
    {
      name: "Tokyo Night",
      color1: "#c0caf5",
      color2: "#a9b1d6",
      color3: "#565f89",
      color4: "#24283b",
      color5: "#1a1b26"
    },
    {
      name: "Monokai Dark",
      color1: "#f8f8f2",
      color2: "#75715e",
      color3: "#414339",
      color4: "#272822",
      color5: "#1e1f1c"
    },
    {
      name: "One Dark",
      color1: "#abb2bf",
      color2: "#61afef",
      color3: "#c678dd",
      color4: "#5c6370",
      color5: "#282c34"
    },
    {
      name: "Solarized Dark",
      color1: "#eee8d5",
      color2: "#93a1a1",
      color3: "#586e75",
      color4: "#073642",
      color5: "#002b36"
    },
    {
      name: "Monochrome Dark",
      color1: "#bfbfbf",
      color2: "#8f8f8f",
      color3: "#5f5f5f",
      color4: "#2f2f2f",
      color5: "#0f0f0f"
    }
  ],
  lightThemes: [
    {
      name: "Catppuccin Latte",
      color1: "#4c4f69",
      color2: "#6c6f85",
      color3: "#9ca0b0",
      color4: "#ccd0da",
      color5: "#eff1f5"
    },
    {
      name: "Catppuccin Frappe",
      color1: "#4c4f69",
      color2: "#595e78",
      color3: "#a6adc8",
      color4: "#b5bfe2",
      color5: "#c6d0f5"
    },
    {
      name: "Solarized Light",
      color1: "#073642",
      color2: "#586e75",
      color3: "#93a1a1",
      color4: "#eee8d5",
      color5: "#fdf6e3"
    },
    {
      name: "Gruvbox Light",
      color1: "#1d2021",
      color2: "#3c3836",
      color3: "#665c54",
      color4: "#0f1011",
      color5: "#fbf1c7"
    },
    {
      name: "Nord Light",
      color1: "#4c566a",
      color2: "#8b91a3",
      color3: "#bfc5d2",
      color4: "#d8dee9",
      color5: "#e5e9f0"
    },
    {
      name: "Monochrome Light",
      color1: "#0f0f0f",
      color2: "#2f2f2f",
      color3: "#bcbcbc",
      color4: "#fefefe",
      color5: "#fefefe"
    }]
}

export function applyTheme(theme) {
  const root = document.documentElement;
  for (let i = 1; i <= 5; i++) {
    root.style.setProperty(`--color${i}`, theme[`color${i}`]);
  }
}

