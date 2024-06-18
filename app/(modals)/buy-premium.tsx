import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { useAuth } from "@/context";
import { X } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Animated as AnimatedRN, Dimensions, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  H3,
  H4,
  ScrollView,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";

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
      <SafeAreaView style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <YStack gap="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <H3>Información de Compra</H3>
            <Button
              pt="$1"
              unstyled
              pressStyle={{
                opacity: 0.7,
              }}
              onPress={() => router.back()}
              icon={<X size="$1" />}
            />
          </XStack>

          <XStack gap="$2" alignItems="center">
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
            <YStack gap="$2">
              <Text fontWeight="bold">
                {userData?.nombres} {userData?.apellidos}
              </Text>
              <Button
                borderRadius="$7"
                disabled
                size="$2"
                bg={userData.rol === "premium" ? "$green8Light" : "$orange10"}
                color="$white1"
              >
                {`Usuario ${userData.rol}`}
              </Button>
            </YStack>
          </XStack>
          <Separator borderColor="$gray5" />

          <H4>Método de Pago</H4>
          <YStack gap="$2">
            <XStack
              borderWidth="$1"
              borderColor="$gray4"
              justifyContent="center"
              p="$1"
              br="$5"
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 4,
                    left: 4,
                    width: "50%",
                    borderRadius: 7,
                    height: "100%",
                  },
                  useAnimatedStyle(() => {
                    return {
                      transform: [{ translateX: animation.value }],
                    };
                  }),
                ]}
              />
              <Button width="50%" p="$2" chromeless onPress={handleCardPayment}>
                Tarjeta Bancaria
              </Button>
              <Button width="50%" p="$2" chromeless onPress={handleYapePayment}>
                Yape
              </Button>
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
