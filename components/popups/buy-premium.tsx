import BuyPremiumAsset from "@/assets/svgs/buy-premium.svg";
import { X } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import * as React from "react";
import { Button, Dialog, H3, Text, YStack } from "tamagui";
type ModalProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BuyPremiumModal({
  openModal,
  setOpenModal,
}: ModalProps) {
  return (
    <Dialog modal open={openModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <LinearGradient
            style={{ borderRadius: 20, padding: 10, shadowRadius: 10 }}
            colors={["#10828d", "#a3e062"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
            <YStack gap="$4" alignItems="center">
              <BuyPremiumAsset width={200} height={220} />
              <H3>Desbloquea Ahora</H3>
              <Text textAlign="center">
                Con el plan <Text fontWeight="bold">Premium</Text> podrás
                acceder a funcionalidades exclusivas.
              </Text>
              <Text textAlign="center" fontStyle="italic">
                ¡Mejora tu experiencia hoy! y sácale el máximo provecho a la app
                🚀
              </Text>
            </YStack>
            <YStack gap="$4">
              <Link href="/(modals)/buy-premium" asChild>
                <Button
                  mt="$5"
                  size="$5"
                  bg="$green8Light"
                  color="$white1"
                  onPress={() => {
                    setOpenModal(false), router.push("/(modals)/buy-premium");
                  }}
                >
                  Adquiere Premium
                </Button>
              </Link>
            </YStack>
          </LinearGradient>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
