import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";

export default function ModalsLayout() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Detalles",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -10 }}
            >
              <XStack alignItems="center">
                <ChevronLeft size="$3" color="$blue10Light" />
                <Text fontSize="$6" color="$blue10Light">
                  Gastos
                </Text>
              </XStack>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              onPress={() => router.push(`/(expenses)/edit/${params.id}`)}
              title="Editar"
            />
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerTitle: "Editar",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -5 }}
            >
              <XStack alignItems="center">
                <ChevronLeft size="$3" color="$blue10Light" />
                <Button onPress={() => router.back()} title="Detalles" />
              </XStack>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              onPress={() => router.replace("/(tabs)")}
              title="Cancelar"
              color="#EE4B2B"
            />
          ),
        }}
      />
    </Stack>
  );
}
