import { useExpenseContext } from "@/context/ExpenseContext";
import useAuth from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import * as React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BudgetLimitExceededModal } from "../popups";
import BuyPremiumModal from "../popups/buy-premium";
import { LinearGradient } from "expo-linear-gradient";
import { Button, H3, H4, XStack, YStack, Text } from "tamagui";

export default function Card() {
  const flip = useSharedValue(0);
  const [totalMonthExpenses, setTotalMonthExpenses] = React.useState(0);
  const { userData } = useAuth();
  // TODO: get this from the actual month
  const { sumOfAllOfExpensesMonthly } = useExpenseContext();
  const [showModal, setShowModal] = React.useState(false);
  const [presupuesto, setPresupuesto] = React.useState(0);
  const getLastBudget = async () => {
    const { data } = await supabase
      .from("presupuestos")
      .select("*")
      .order("fecha_final", {
        ascending: false,
      })
      .limit(1);
    if (data) {
      setPresupuesto(data[0].monto);
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flip.value,
      [0, 1],
      [0, 360],
      Extrapolation.CLAMP
    );
    const rotateX = interpolate(
      flip.value,
      [0, 0.5, 1],
      [30, 0, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 }, // Add perspective to enhance 3D effect
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
      ],
      backfaceVisibility: "hidden",
    };
  });

  React.useEffect(() => {
    async function fetchExpenses() {
      const totalExpenses = await sumOfAllOfExpensesMonthly();
      setTotalMonthExpenses(totalExpenses);
    }
    getLastBudget();
    fetchExpenses();
  }, [userData]);

  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    flip.value = withTiming(1, { duration: 2000 });
  }, []);

  const balance = presupuesto - totalMonthExpenses;

  React.useEffect(() => {
    if (balance <= 0) {
      setShowModal(true);
    }
  }, [balance]);
  return (
    <Animated.View style={[styles.cardStyle, animatedStyles]}>
      <BuyPremiumModal setOpenModal={setOpenModal} openModal={openModal} />
      <Pressable
        onPress={() => {
          if (userData.rol === "premium") {
            Alert.alert(
              "Premium",
              "Ya eres usuario premium, tienes acceso a todas las funcionalidades."
            );
          } else {
            setOpenModal(true);
          }
        }}
        style={styles.shadowContainer}
      >
        <LinearGradient
          colors={
            userData.rol === "premium"
              ? ["#D4AF37", "#FFD700", "#A79647"]
              : ["#6366F1", "#6D28D9"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardStyle}
        >
          <XStack justifyContent="space-between">
            <View>
              <H4 color="$white1">Balance</H4>
              <H3 color="$white1">S/. {balance}</H3>
            </View>
            <BudgetLimitExceededModal
              setShowModal={setShowModal}
              showModal={showModal}
            />
            <Button
              size="$2.5"
              borderRadius="$7"
              bg={userData.rol === "premium" ? "$yellow10" : "$orange10"}
            >
              <Text color="$white1">
                {userData.rol === "premium" ? "Premium" : "Plan Free"}
              </Text>
            </Button>
          </XStack>
          <XStack justifyContent="space-between">
            <YStack>
              <XStack>
                <Text color="$white1">Gastos</Text>
              </XStack>
              <H4 color="$white1">S/. {totalMonthExpenses}</H4>
            </YStack>
            <YStack>
              <XStack>
                <Text color="$white1">Presupuesto</Text>
              </XStack>
              <H4 color="$white1">S/. {presupuesto}</H4>
            </YStack>
          </XStack>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 55,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  shadowContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
    backgroundColor: "rgba(255, 255, 255, 0.001)",
  },
});
