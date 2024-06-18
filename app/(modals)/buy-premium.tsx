import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { useAuth } from "@/context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  Animated as AnimatedRN,
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, ScrollView, Separator, Text, XStack, YStack } from "tamagui";

export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(false);
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(true);
  const screenWidth = Dimensions.get("window").width;
  const { userData } = useAuth();
  const animation = useSharedValue(0);
  const handlePress = (index: number) => {
    animation.value = withTiming((index * screenWidth) / 2.3, {
      duration: 300,
    });
  };
  const fadeAnimCard = React.useRef(new AnimatedRN.Value(1)).current;
  const fadeAnimYape = React.useRef(new AnimatedRN.Value(1)).current;
  React.useEffect(() => {
    AnimatedRN.timing(fadeAnimCard, {
      toValue: yapePaymentMethod ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [yapePaymentMethod]);

  React.useEffect(() => {
    AnimatedRN.timing(fadeAnimYape, {
      toValue: cardPaymentMethod ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [cardPaymentMethod]);

  const handleYapePayment = () => {
    setYapePaymentMethod(true);
    setCardPaymentMethod(false);
    handlePress(1);
  };
  const handleCardPayment = () => {
    setYapePaymentMethod(false);
    setCardPaymentMethod(true);
    handlePress(0);
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <YStack gap="$4" className="px-5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">Información de Compra</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="close" size={20} />
            </TouchableOpacity>
          </XStack>

          <XStack space={3}>
            <Avatar bg="teal.600" alignSelf="center" size="$10">
              <Avatar.Image
                accessibilityLabel="avatar"
                src={userData.foto}
                style={{
                  borderRadius: 100,
                  width: 100,
                  height: 100,
                }}
              />
              <Avatar.Fallback backgroundColor={"#F5F5F5"} />
            </Avatar>
            <YStack>
              <Text className="font-bold  text-lg ">
                {userData?.nombres} {userData?.apellidos}
              </Text>
              <Text
                br="$5"
                p="$2"
                bg={userData.rol === "premium" ? "red10Light" : "$green10Light"}
              >
                {`Usuario ${userData.rol}`}
              </Text>
            </YStack>
          </XStack>
          <Separator borderColor="$gray5" />

          <Text className=" font-semibold text-xl  ">Método de Pago</Text>
          <YStack gap="$2">
            <XStack bg="#F2F3EE" justifyContent="center" p={1} br="$4">
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 4,
                    left: 4,
                    width: "50%",
                    borderRadius: 7,
                    height: "100%",
                    backgroundColor: "white", //TODO change to user avatar
                  },
                  useAnimatedStyle(() => {
                    return {
                      transform: [{ translateX: animation.value }],
                    };
                  }),
                ]}
              />
              <Pressable
                style={{
                  padding: 2,
                  width: "50%",
                }}
                onPress={handleCardPayment}
              >
                <Text className="font-semibold text-center">
                  Tarjeta Bancaria
                </Text>
              </Pressable>
              <Pressable
                style={{
                  padding: 2,
                  width: "50%",
                }}
                onPress={handleYapePayment}
              >
                <Text className="font-semibold text-center">Yape</Text>
              </Pressable>
            </XStack>

            {cardPaymentMethod ? (
              <AnimatedRN.View style={{ opacity: fadeAnimCard }}>
                <Stripe />
              </AnimatedRN.View>
            ) : (
              <AnimatedRN.View style={{ opacity: fadeAnimYape }}>
                <Yape />
              </AnimatedRN.View>
            )}
          </YStack>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </YStack>
      </SafeAreaView>
    </ScrollView>
  );
}
