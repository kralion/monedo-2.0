import { ISaving } from "@/interfaces/saving";
import { X } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import * as React from "react";
import { Button, Dialog, ListItem, Text, YStack } from "tamagui";
export function Metas({ metas }: { metas: ISaving }) {
  const { meta_ahorro, ahorro_actual, presupuesto_id } = metas;
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);

  return (
    <ListItem
      onPress={() => {
        setOpenBudgetDetails(true);
      }}
      pressTheme
      title={
        <YStack>
          <Text fontWeight="bold">Meta de ahorro </Text>
          <Text>Identificador </Text>
        </YStack>
      }
      icon={
        <Image
          source={{
            uri: "https://img.icons8.com/?size=48&id=ek6vl8DEBehk&format=png",
          }}
          style={{
            width: 40,
            height: 40,
          }}
        />
      }
      subTitle={ahorro_actual}
      iconAfter={<Text color="$red10"> S/. {meta_ahorro}</Text>}
    >
      <Dialog modal open={openBudgetDetails}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            opacity={0.7}
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
            enterStyle={{
              x: 0,
              y: -20,
              opacity: 0,
              scale: 0.9,
            }}
            exitStyle={{
              x: 0,
              y: 10,
              opacity: 0,
              scale: 0.95,
            }}
            gap="$4"
          >
            <Dialog.Title>Detalles de la Meta de Ahorro</Dialog.Title>
            <Dialog.Description>
              Aqui podrás ver los detalles de la meta de ahorro que has
              seleccionado.
            </Dialog.Description>

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
            <YStack space={3}>
              <YStack>
                <Text className="font-bold">Monto</Text>
                <Text>S/. {meta_ahorro}</Text>
              </YStack>
              <YStack>
                <Text className="font-bold">Ahorraste hasta ahora</Text>
                <Text>{ahorro_actual}</Text>
              </YStack>
              <YStack>
                <Text className="font-bold">El presupuesto vence en</Text>
                <Text>{presupuesto_id}</Text>
              </YStack>
              <YStack>
                <Text className="font-bold">Descripción</Text>
                <Text>{presupuesto_id}</Text>
              </YStack>
            </YStack>
            <YStack gap="$4">
              <Button
                onPress={() => {
                  setOpenBudgetDetails(false);
                }}
              >
                Cerrar
              </Button>
              <Button
                onPress={() => {
                  alert("La funcionalidad aun no esta disponible");
                }}
              >
                Editar
              </Button>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </ListItem>
  );
}
