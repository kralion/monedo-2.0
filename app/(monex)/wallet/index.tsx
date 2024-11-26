import { SavingGoalModal } from "@/components/popups/save-goals";
import { Budget } from "@/components/wallet/budget";
import { useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { ChevronUp, CircleDollarSign, Info } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import {
  Button,
  Input,
  Label,
  ScrollView,
  SizableText,
  Spinner,
  Text,
  TextArea,
  View,
  XStack,
  YStack,
  styled,
  useTheme,
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
  const { user: userData } = useUser();
  const toast = useToastController();

  async function onSubmit(data: IBudget) {
    setIsLoading(true);
    let date = new Date();
    date.setDate(date.getDate() + 30);
    let fecha_final = date;
    addBudget({
      ...data,
      usuario_id: userData?.id ?? "9e683f71-8a18-4a91-a596-c956813405e9",
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
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler.value > 5 ? withTiming(1) : withTiming(0),
    };
  });
  function scrollToTop() {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }
  const headerHeight = useHeaderHeight();

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        style={{
          paddingHorizontal: 16,
          minHeight: "100%",
        }}
      >
        <YStack
          gap="$3"
          borderBottomStartRadius="$4"
          borderBottomEndRadius="$4"
        >
          //TODO: Put this form in a modal.
          {budgetFormAvailable && (
            <>
              <YStack mt={5} gap="$3">
                <XStack justifyContent="space-between">
                  <Label size="$5">Monto : </Label>
                  <YStack width="80%">
                    <Controller
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: "Ingrese el monto",
                        },
                        pattern: {
                          value: /^\d+(\.\d*)?$/,
                          message: "Solo números",
                        },
                      }}
                      name="monto"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          size="$5"
                          autoCapitalize="none"
                          onChangeText={onChange}
                          // value={String(value)}
                          placeholder="650.00"
                          placeholderTextColor={placeholderTextColor}
                          keyboardType="decimal-pad"
                        />
                      )}
                    />
                  </YStack>
                </XStack>
                <YStack>
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
                        placeholder="Descripcion sobre el presupuesto del mes"
                      />
                    )}
                  />
                  {errors.descripcion && (
                    <XStack gap="$1.5" ml="$2" mt="$2" alignItems="center">
                      <Info color="$red9Light" size={15} />
                      <Text fontSize="$3" color="$red9Light">
                        {errors.descripcion.message}
                      </Text>
                    </XStack>
                  )}
                </YStack>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  size="$5"
                  mt="$5"
                  bg="$green9Light"
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
          <FlashList
            data={budgets}
            estimatedItemSize={100}
            renderItem={({ item }) => <Budget budget={item} />}
          />
        </YStack>
      </ScrollView>
      <Animated.View
        style={[
          buttonStyle,
          {
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
          },
        ]}
      >
        <Button w="$5" h="$5" circular onPress={scrollToTop}>
          <ChevronUp />
        </Button>
      </Animated.View>
    </View>
  );
}
