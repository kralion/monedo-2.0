import { Stack } from "expo-router";
import { useTheme } from "tamagui";

export default function Layout() {
  const theme = useTheme();
  const bgColor = theme.color.name === "dark" ? "#fff" : "#000";
  return (
    <Stack>
      <Stack.Screen
        options={{
          title: "Presupuesto",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
          },
          // headerStyle: {
          //   backgroundColor: bgColor,
          // },

          headerLargeTitleShadowVisible: false,
        }}
        name="index"
      />
    </Stack>
  );
}
