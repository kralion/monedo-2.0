import { useAuth, useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { Info } from "@tamagui/lucide-icons";
import {
  Avatar,
  Button,
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
      <YStack gap="$5" p="$4">
        <XStack gap="$4" alignItems="center">
          <Avatar bg="teal.600" alignSelf="center" size="$10">
            <Avatar.Image
              accessibilityLabel="avatar"
              src={require("../../assets/logo.png")}
            />
            <Avatar.Fallback backgroundColor={"#F5F5F5"} />
          </Avatar>

          <YStack gap="$2">
            <H4>
              {has?.({ permission: "premium:plan" })
                ? "Plan Pro"
                : "Plan Gratuito"}
            </H4>

            <Text color="$gray10Light">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text color="$gray10Light">
              Ciclo Facturación:{" "}
              <Text className="text-sm font-semibold">
                {has?.({ permission: "premium:plan" }) ? "20/12" : "15/12"}
              </Text>
            </Text>
          </YStack>
        </XStack>
        <Separator borderColor="$gray8" />
        <YStack gap="$4" borderRadius="$4">
          <XStack gap="$2" alignItems="center">
            <Info size={24} color="$green9Light" />
            <Text fontSize="$4">Información del Plan</Text>
          </XStack>
          <YStack gap="$5">
            <Text>
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <XStack gap="$1" alignItems="center">
              <Text color="$gray10Light">Titular de la cuenta: </Text>
              <Text fontWeight="bold">
                {userData?.firstName} {userData?.lastName}
              </Text>
            </XStack>
          </YStack>
        </YStack>
        <Separator borderColor="$gray8" />
        <H4 letterSpacing={-0.5}>Monto de Recargo</H4>
        <Button
          disabled
          size="$5"
          bg={
            has?.({ permission: "premium:plan" }) ? "$green9Light" : "$orange10"
          }
          color="$white1"
        >
          {has?.({ permission: "premium:plan" })
            ? "S/. 15.00 / mes"
            : "S/. 00.00 / mes"}
        </Button>
      </YStack>
    </ScrollView>
  );
}
