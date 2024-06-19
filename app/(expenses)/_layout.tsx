import { Feather } from "@expo/vector-icons";
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
          title: "",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <XStack alignItems="center">
                  <Feather name="chevron-left" size={24} color="#3b82f6" />
                  <Text>Gastos</Text>
                </XStack>
              </TouchableOpacity>
            );
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.push(`/(expenses)/${params.id}`);
              }}
            >
              <Text className="text-blue-500 text-[17px] pr-2">Editar</Text>
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
            >
              <XStack alignItems="center">
                <Feather name="chevron-left" size={24} color="#3b82f6" />
                <Text>Detalles</Text>
              </XStack>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-red-500 text-[17px] pr-2">Cancelar</Text>
            </TouchableOpacity>
          ),

          headerTitle: "",
        }}
      />
    </Stack>
  );
}
