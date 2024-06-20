import { IBudget } from "@/interfaces";
import { X } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import * as React from "react";
import { Button, Dialog, ListItem, Text, YStack } from "tamagui";
export function Budget({ budget }: { budget: IBudget }) {
  const { monto, fecha_final, descripcion, fecha_registro } = budget;
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);
  const date = new Date(fecha_final);
  const endDate = new Date(fecha_final);

  return (
    <ListItem
      onPress={() => {
        setOpenBudgetDetails(true);
      }}
      pressTheme
      pressStyle={{
        opacity: 0.8,
      }}
      borderRadius="$5"
      mb="$3"
      title={
        <Text fontSize="$6" fontWeight="700">
          {date
            .toLocaleDateString("es-ES", {
              month: "long",
            })
            .toUpperCase()}
        </Text>
      }
      icon={
        <Image
          source={{
            uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
          }}
          style={{
            width: 45,
            height: 45,
          }}
        />
      }
      subTitle={
        <Text>
          {endDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      }
      iconAfter={<Text fontWeight="bold"> S/. {monto.toFixed(2)}</Text>}
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
            borderRadius={16}
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
            <Dialog.Title>Detalles</Dialog.Title>
            <Dialog.Description>
              Mostrando información relevante sobre el presupuesto seleccionado.
            </Dialog.Description>

            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                onPress={() => {
                  setOpenBudgetDetails(false);
                }}
                circular
                icon={X}
              />
            </Dialog.Close>
            <YStack gap="$4">
              <YStack gap="$1">
                <Text>Monto</Text>
                <Text fontWeight="bold">S/. {monto.toFixed(2)}</Text>
              </YStack>
              <YStack gap="$1">
                <Text>Descripcion</Text>
                <Text>{descripcion}</Text>
              </YStack>
              <YStack gap="$1">
                <Text>Fecha Registro</Text>
                <Text fontWeight="bold">
                  {date.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </YStack>
              <YStack gap="$1">
                <Text className="font-bold">Fecha Expiración</Text>
                <Text fontWeight="bold">
                  {endDate.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </YStack>
            </YStack>
            <Button
              mt="$5"
              bg="$green8Light"
              color="$white1"
              onPress={() => {
                alert("La funcionalidad aun no esta disponible");
              }}
            >
              Editar
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </ListItem>
  );
}
