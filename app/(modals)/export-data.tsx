import { FontAwesome } from "@expo/vector-icons";
import { Alert, Image } from "react-native";
import { Button, H2, ScrollView, Text, XStack, YStack } from "tamagui";
import ExportAsset from "@/assets/svgs/export.svg";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Export() {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <YStack alignItems="center" gap="$6" p="$3">
        <ExportAsset width={300} height={300} />
        <Text fontSize="$5" textAlign="center" px="$5">
          Formatos en los que puedes exportar tu historial de gastos
        </Text>

        <YStack mt={10} gap="$3" width="100%">
          <Button
            size="$5"
            bg="$blue10Light"
            color="$white1"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
            icon={
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=48&id=13674&format=png",
                }}
                style={{ width: 30, height: 30 }}
              />
            }
          >
            Documento
          </Button>
          <Button
            size="$5"
            bg="$green10Light"
            color="$white1"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
            icon={
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=48&id=13654&format=png",
                }}
                style={{ width: 30, height: 30 }}
              />
            }
          >
            Hoja de Cálculo
          </Button>
          <Button
            size="$5"
            bg="$red10Light"
            color="$white1"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
            icon={
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=48&id=13417&format=png",
                }}
                style={{ width: 30, height: 30 }}
              />
            }
          >
            Archivo PDF
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
