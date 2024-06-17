import { IBudget } from "@/interfaces";
import { X } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import * as React from "react";
import { Button, Dialog, ListItem, Text, YStack } from "tamagui";
export function Budget({ budget }: { budget: IBudget }) {
  const { monto, fecha_final, descripcion, fecha_registro } = budget;
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);

  return (
    <ListItem
      onPress={() => {
        setOpenBudgetDetails(true);
      }}
      pressTheme
      title={
        <YStack>
          <Text fontWeight="bold">Presupuesto </Text>
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
      subTitle={fecha_final}
      iconAfter={<Text color="$red10"> S/. {monto}</Text>}
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
                <Text fontWeight="bold">Monto</Text>
                <Text>S/. {monto}</Text>
              </YStack>
              <YStack>
                <Text>Descripcion</Text>
                <Text>{descripcion}</Text>
              </YStack>
              <YStack>
                <Text>Fecha Registro</Text>
                <Text>{fecha_registro}</Text>
              </YStack>
              <YStack>
                <Text className="font-bold">Fecha Expiración</Text>
                <Text>{fecha_final}</Text>
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
