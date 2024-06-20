import { SavingGoalModal } from "@/components/popups/save-goals";
import { Budget } from "@/components/wallet/budget";
import { useAuth, useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { CircleDollarSign, Info } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextArea, View, XStack, styled } from "tamagui";
import { SizableText } from "tamagui";
import { useTheme } from "tamagui";
import {
  Button,
  H2,
  H4,
  Input,
  Label,
  ScrollView,
  Spinner,
  Text,
  YStack,
} from "tamagui";
interface Item extends IBudget {
  duration: string;
}

export default function Wallet() {
  const [showSavingGoalModal, setShowSavingGoalModal] = useState(false);
  const { budgets, addBudget, getRecentBudgets } = useBudgetContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Item>();
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
  const StyledXStack = styled(XStack, {
    backgroundColor: isDarkMode ? "$gray8" : "$gray4",
    borderRadius: "$4",
    alignItems: "center",
    px: "$2",
    pl: "$3",
  });
  const inputIconColor = isDarkMode ? "$gray5" : "$gray9";
  const placeholderTextColor = isDarkMode ? "$gray5" : "$gray9";

  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();
  const toast = useToastController();

  async function onSubmit(data: IBudget) {
    setIsLoading(true);
    let date = new Date();
    date.setDate(date.getDate() + 30);
    let fecha_final = date;
    addBudget({
      ...data,
      usuario_id: userData.id,
      fecha_registro: new Date(),
      fecha_final,
    });
    setIsLoading(false);
    toast.show("Meta registrada correctamente");
    reset();
  }

  useEffect(() => {
    if (userData) {
      getRecentBudgets(userData.id);
    }
  }, [userData, getRecentBudgets]);

  const [budgetFormAvailable, setBudgetFormAvailable] = useState(true);
  const [walletText, setWalletText] = useState(
    `Crea un presupuesto para ${new Date()
      .toLocaleDateString("es-ES", {
        month: "long",
      })
      .toUpperCase()}`
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <YStack
            gap="$3"
            borderBottomStartRadius="$4"
            borderBottomEndRadius="$4"
          >
            <YStack gap="$2">
              <H2>Presupuestos</H2>
              <Text>{walletText}</Text>
            </YStack>
            {budgetFormAvailable && (
              <>
                <YStack mt={5}>
                  <YStack>
                    <Label>Monto</Label>

                    <Controller
                      control={control}
                      rules={{
                        required: { value: true, message: "Ingrese el monto" },
                        pattern: {
                          value: /^\d+(\.\d*)?$/,
                          message: "Solo números",
                        },
                      }}
                      name="monto"
                      render={({ field: { onChange, value } }) => (
                        <StyledXStack>
                          <XStack opacity={0.5} mt="$2">
                            <SizableText color={inputIconColor}>
                              <CircleDollarSign />
                            </SizableText>
                          </XStack>
                          <Input
                            size="$5"
                            autoCapitalize="none"
                            borderRadius="$3"
                            onChangeText={onChange}
                            value={String(value)}
                            placeholder="650.00"
                            placeholderTextColor={placeholderTextColor}
                            flex={1}
                            backgroundColor="transparent"
                            keyboardType="decimal-pad"
                          />
                        </StyledXStack>
                      )}
                    />
                    {errors.monto && (
                      <XStack gap="$1.5" ml="$2" alignItems="center">
                        <Info color="$red9Light" size={15} />
                        <Text fontSize="$3" color="$red9Light">
                          {errors.monto.message}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                  <YStack>
                    <Label>Descripcion</Label>
                    <Controller
                      control={control}
                      name="descripcion"
                      render={({ field: { onChange, value } }) => (
                        <TextArea
                          size="$4"
                          autoCapitalize="none"
                          borderRadius="$5"
                          value={value}
                          onChangeText={onChange}
                          placeholder="Espero no sobrepasar esta vez..."
                        />
                      )}
                    />
                    {errors.monto && (
                      <XStack gap="$1.5" ml="$2" alignItems="center">
                        <Info color="$red9Light" size={15} />
                        <Text fontSize="$3" color="$red9Light">
                          {errors.monto.message}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    size="$5"
                    mt="$5"
                    bg="$green8Light"
                    color="$white1"
                  >
                    {isLoading ? (
                      <Spinner size="small" color="$white1" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </YStack>

                <SavingGoalModal
                  openModal={showSavingGoalModal}
                  setOpenModal={setShowSavingGoalModal}
                />
              </>
            )}
          </YStack>
        </SafeAreaView>
        <ScrollView m="$3">
          <YStack paddingBottom="$5">
            <FlashList
              data={budgets}
              estimatedItemSize={100}
              renderItem={({ item }) => <Budget budget={item} />}
            />
          </YStack>
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  );
}
