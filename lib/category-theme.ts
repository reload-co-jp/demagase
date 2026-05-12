const CATEGORY_THEMES: Record<string, { background: string; border: string; chipBg: string; chipBorder: string; chipText: string }> = {
  語源: {
    background: "#fff7e8",
    border: "#f0d9a6",
    chipBg: "#fff1cf",
    chipBorder: "#efd8a0",
    chipText: "#9a6a00",
  },
  食べ物: {
    background: "#fff2ec",
    border: "#f3c8b4",
    chipBg: "#ffe5d9",
    chipBorder: "#efc5b1",
    chipText: "#b6592a",
  },
  "科学・医学": {
    background: "#eef8ff",
    border: "#c5dff0",
    chipBg: "#dff0fb",
    chipBorder: "#c4dceb",
    chipText: "#2d6f96",
  },
  日本文化: {
    background: "#f7f0ff",
    border: "#ddcff3",
    chipBg: "#efe3ff",
    chipBorder: "#dbcbf2",
    chipText: "#7850aa",
  },
  歴史: {
    background: "#f5f2ea",
    border: "#ddd1b8",
    chipBg: "#eee6d8",
    chipBorder: "#dacdb7",
    chipText: "#756040",
  },
  言葉: {
    background: "#eefaf2",
    border: "#c9e8d2",
    chipBg: "#def3e6",
    chipBorder: "#c8e2d1",
    chipText: "#2f7f56",
  },
  生活: {
    background: "#f4f4ff",
    border: "#d6d6f0",
    chipBg: "#e7e7fb",
    chipBorder: "#d5d6ee",
    chipText: "#5f63a8",
  },
}

const FALLBACK_THEME = {
  background: "#f7f9fb",
  border: "#d7e0e7",
  chipBg: "#eaf4ff",
  chipBorder: "#d3e4f8",
  chipText: "#2f6fb2",
}

export function getCategoryTheme(category: string) {
  return CATEGORY_THEMES[category] ?? FALLBACK_THEME
}
