import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Button, Text, XStack } from "tamagui";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="export-data"
        options={{
          headerLeft: () => {
            return (
              <Button
                pressStyle={{
                  opacity: 0.7,
                }}
                onPress={() => {
                  router.back();
                }}
                unstyled
                p="$2"
                icon={
                  <FontAwesome5 name="chevron-left" size={20} color="teal" />
                }
              />
            );
          },
          presentation: "card",
          title: "Exportar",
        }}
      />
      <Stack.Screen name="buy-premium" options={{ headerShown: false }} />

      <Stack.Screen
        name="notifications"
        options={{
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <XStack alignItems="center">
                  <Feather name="chevron-left" size={24} color="#3b82f6" />
                  <Text>Perfil</Text>
                </XStack>
              </TouchableOpacity>
            );
          },
          presentation: "card",
          title: "Notificaciones",
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          presentation: "card",
          title: "Membresía",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <XStack alignItems="center">
                  <Feather name="chevron-left" size={24} color="#3b82f6" />
                  <Text>Perfil</Text>
                </XStack>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          presentation: "modal",
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personal-info"
        options={{
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <XStack alignItems="center">
                  <Feather name="chevron-left" size={24} color="#3b82f6" />
                  <Text>Perfil</Text>
                </XStack>
              </TouchableOpacity>
            );
          },
          presentation: "card",
          title: "Datos Personales",
        }}
      />
    </Stack>
  );
}
