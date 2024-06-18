import { useAuth, usePremiumStatusContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Button, Input, Spinner, Text, YStack } from "tamagui";

interface ICard {
  cardNumber: string;
  cvc: string;
  expiracion: string;
  monto: string;
  divisa: string;
  mensaje: string;
}

export default function Stripe() {
  const { setIsPremium } = usePremiumStatusContext();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { userData } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICard>({
    defaultValues: {
      divisa: "pen",
    },
  });
  async function updateUserRole(userId: string | undefined) {
    const { error } = await supabase
      .from("usuarios")
      .update({ rol: "free" })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
    }
  }
  async function onSubmit(data: ICard) {
    setIsLoading(true);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(createdAt.getMonth() + 1);
    const { error } = await supabase.from("payments").insert({
      usuario_id: userData.id,
      created_At: createdAt.toISOString(),
      expires_At: expiresAt.toISOString(),
      card_data: JSON.stringify(data),
    });

    await updateUserRole("972cf283-22e9-4224-bb76-3d5805884f1b");
    if (error) {
      console.error("Error inserting payment:", error);
    }
    setIsPremium(true);
    reset();
    setIsLoading(false);
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/(tabs)/");
    }, 3000);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack p="$3" gap="$4">
        {showConfetti && (
          <ConfettiCannon autoStart count={200} origin={{ x: 50, y: 50 }} />
        )}
        <YStack gap="$3">
          <YStack gap="$1">
            <Text>Número de Tarjeta</Text>

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  size="lg"
                  keyboardType="number-pad"
                  my={3}
                  value={value}
                  onChangeText={(value) => onChange(value)}
                  // rightElement={
                  //   <FontAwesome5
                  //     name="credit-card"
                  //     color="#6D6868"
                  //     marginRight={10}
                  //     size={15}
                  //   />
                  // }
                  placeholder="1234 1234 1234 1234"
                  borderRadius={7}
                />
              )}
              name="cardNumber"
              rules={{
                required: {
                  value: true,
                  message: "Ingrese el número de tarjeta",
                },
                pattern: {
                  value: /^\d+(\.\d*)?$/,
                  message: "Solo caracteres válidos",
                },
              }}
            />
          </YStack>

          <YStack gap="$1">
            <Text>CVC / CVV</Text>

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  size="lg"
                  keyboardType="number-pad"
                  my={3}
                  value={value}
                  onChangeText={(value) => onChange(value)}
                  // rightElement={
                  //   <MaterialCommunityIcons
                  //     name="identifier"
                  //     color="#6D6868"
                  //     marginRight={10}
                  //     size={20}
                  //   />
                  // }
                  placeholder="123"
                  borderRadius={7}
                />
              )}
              name="cvc"
              rules={{
                required: {
                  value: true,
                  message: "Ingrese el CVC/CVV de la tarjeta",
                },
                pattern: {
                  value: /^\d+(\.\d*)?$/,
                  message: "Solo caracteres válidos",
                },
              }}
            />
          </YStack>
          <YStack gap="$1">
            <Text>Fecha Expiración</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  size="lg"
                  keyboardType="number-pad"
                  my={3}
                  value={value}
                  onChangeText={(value) => {
                    if (value.length === 2 && !value.includes("/")) {
                      onChange(value + "/");
                    } else {
                      onChange(value);
                    }
                  }}
                  // rightElement={
                  //   <MaterialCommunityIcons
                  //     name="calendar-month"
                  //     color="#6D6868"
                  //     marginRight={10}
                  //     size={20}
                  //   />
                  // }
                  placeholder="MM/YY"
                  borderRadius={7}
                />
              )}
              name="expiracion"
              rules={{
                required: {
                  value: true,
                  message: "Ingrese la fecha de expiración",
                },
                pattern: {
                  value: /^\d+(\.\d*)?$/,
                  message: "Solo caracteres válidos",
                },
              }}
            />
          </YStack>
          <Button disabled size="$5" fontSize="$5" bg="$gray8">
            S/. 15.00 PEN
          </Button>
        </YStack>

        <Button
          onPress={() => setShowConfetti(true)}
          size="$5"
          bg="$green8Light"
          color="$white1"
          mt="$5"
          mb="$12"
        >
          {isLoading ? (
            <Spinner size="small" color="$white1" />
          ) : (
            "Realizar Compra"
          )}
        </Button>
      </YStack>
    </TouchableWithoutFeedback>
  );
}
