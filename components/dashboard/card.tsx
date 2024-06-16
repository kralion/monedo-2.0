import { useExpenseContext } from "@/context/ExpenseContext";
import useAuth from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import * as React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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
import { Button, H3, H4, XStack, YStack } from "tamagui";

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
              <H4>Balance</H4>
              <H3>S/. {balance}</H3>
            </View>
            <BudgetLimitExceededModal
              setShowModal={setShowModal}
              showModal={showModal}
            />
            <Button bg={userData.rol === "premium" ? "$yellow10" : "$orange10"}>
              <Text>
                {userData.rol === "premium" ? "Premium" : "Plan Free"}
              </Text>
            </Button>
          </XStack>
          <XStack justifyContent="space-between">
            <YStack>
              <XStack>
                <Text>Gastos</Text>
              </XStack>
              <H4>S/. {totalMonthExpenses}</H4>
            </YStack>
            <YStack>
              <XStack>
                <Text>Presupuesto</Text>
              </XStack>
              <Text>S/. {presupuesto}</Text>
            </YStack>
          </XStack>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: "90%",
    height: 200,
    left: 21,
    position: "absolute",
    zIndex: 1,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 50,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
  shadowContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 30,
    backgroundColor: "rgba(255, 255, 255, 0.001)",
  },
});
