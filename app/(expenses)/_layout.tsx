import { Feather } from "@expo/vector-icons";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
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
            <TouchableOpacity
              onPress={() => {
                router.push(`/(expenses)/edit/${params.id}`);
              }}
            >
              <Text fontSize="$6" color="$blue10Light">
                Editar
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
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
                  Detalles
                </Text>
              </XStack>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text fontSize="$6" color="$red10Light">
                Cancelar
              </Text>
            </TouchableOpacity>
          ),

          headerTitle: "",
        }}
      />
    </Stack>
  );
}
