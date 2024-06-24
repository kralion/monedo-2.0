import { Stack } from "expo-router";
import { useTheme } from "tamagui";

export default function Layout() {
  const theme = useTheme();
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
          headerLargeTitleShadowVisible: false,
        }}
        name="index"
      />
    </Stack>
  );
}
