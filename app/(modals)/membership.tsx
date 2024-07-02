import { useAuth, useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { BadgeInfo } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import {
  Button,
  H3,
  H4,
  ScrollView,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function Membership() {
  const { user: userData } = useUser();
  const { has } = useAuth();

  const headerHeight = useHeaderHeight();
  const dateFormatted = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const timeformatted = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <YStack gap="$4" p="$4">
        <XStack gap="$4" alignItems="center">
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
            }}
            source={require("../../assets/icon.png")}
          />
          <YStack gap="$2">
            <H4>
              {has?.({ permission: "free:plan" }) ? "Plan Básico" : "Plan Pro"}
            </H4>

            <Text color="$gray10Light">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text color="$gray10Light">
              Ciclo Facturación:{" "}
              <Text className="text-sm font-semibold">
                {has?.({ permission: "free:plan" }) ? "20/12" : "15/12"}
              </Text>
            </Text>
          </YStack>
        </XStack>
        <Separator borderColor="$gray8" />
        <YStack gap="$4" bg="$gray6" p="$4" borderRadius="$4">
          <XStack gap="$2" alignItems="center">
            <BadgeInfo size={24} color="$green9Light" />
            <Text fontSize="$4">Información del Plan</Text>
          </XStack>
          <YStack gap="$4">
            <Text className="text-sm mb-3 text-mute">
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <XStack>
              <Text color="$gray10Light">Titular de la cuenta: </Text>
              <Text>
                {userData?.firstName} {userData?.lastName}
              </Text>
            </XStack>
          </YStack>
        </YStack>
        <H3>Monto Recargo</H3>
        <Button
          disabled
          size="$5"
          bg={has?.({ permission: "free:plan" }) ? "$orange10" : "$green9Light"}
          color="$white1"
        >
          {has?.({ permission: "free:plan" })
            ? "S/. 00.00 PEN / mes"
            : "S/. 00.20 PEN / mes"}
        </Button>
      </YStack>
    </ScrollView>
  );
}
