import { FontAwesome } from "@expo/vector-icons";
import { Alert, Image } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function Export() {
  return (
    <YStack className="flex flex-col space-y-6 justify-between">
      <YStack space={1} className="bg-background rounded-b-lg py-4 px-7">
        <XStack>
          {/* <View className="bg-accent w-2 h-8 rounded-full my-3 " /> */}
          <Text fontWeight="bold">Formatos de Exportación</Text>
        </XStack>

        <Text>
          Selecciona el tipo de documento en el que desea exportar su historial
          de gastos
        </Text>

        <YStack mt={10} space={4}>
          <XStack space={4}>
            <Button
              onPress={() =>
                Alert.alert("Exportación", "Se exportó correctamente")
              }
            >
              <XStack alignItems="center">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=48&id=13674&format=png",
                  }}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
                <Text className="font-semibold text-black">Documento</Text>
              </XStack>
            </Button>

            <Button
              onPress={() =>
                Alert.alert("Exportación", "Se exportó correctamente")
              }
            >
              <XStack alignItems="center">
                <Image
                  style={{ width: 30, height: 30, marginRight: 10 }}
                  source={{
                    uri: "https://img.icons8.com/?size=48&id=13654&format=png",
                  }}
                />
                <Text className="font-semibold text-black">
                  Hoja de Cálculo
                </Text>
              </XStack>
            </Button>
          </XStack>

          <Button
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <XStack alignItems="center">
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={{
                  uri: "https://img.icons8.com/?size=48&id=13417&format=png",
                }}
              />
              <Text className="font-semibold text-black">Archivo PDF</Text>
            </XStack>
          </Button>
        </YStack>
        <Button
          className="rounded-lg  mt-14"
          height={10}
          icon={
            <FontAwesome
              name="download"
              color="white"
              marginRight={3}
              marginTop={2}
            />
          }
        >
          <Text
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            Exportar en los 3 formatos
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
