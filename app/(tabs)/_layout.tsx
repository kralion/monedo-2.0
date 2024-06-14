import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import { Atom, AudioWaveform } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Atom color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Button mr="$4" themeInverse bg="$purple8" color="$purple12">
          //       Modal
          //     </Button>
          //   </Link>
          // ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <AudioWaveform color={color} />,
        }}
      />
    </Tabs>
  );
}
