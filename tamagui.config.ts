import { config as configBase } from "@tamagui/config/v3";
import { createTamagui, createTokens } from "tamagui";

export const tokens = createTokens({
  ...configBase.tokens,
  color: {
    ...configBase.tokens.color,
    green9Light: "rgb(44, 179, 150)",
  },
});

const lightTheme = {
  ...configBase.themes.light,
  background: tokens.color.green9Light,
};

export const config = createTamagui({
  ...configBase,
  tokens,
  themes: {
    ...configBase.themes,
    light: lightTheme,
  },
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
