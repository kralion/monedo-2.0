import Card from "@/components/dashboard/card";
import { Expense } from "@/components/dashboard/expense";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { useExpenseContext } from "@/context";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { ChevronUp, Lock } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Animated as AnimatedRN } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H3,
  H4,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function Home() {
  const fadeAnim = React.useRef(new AnimatedRN.Value(1)).current;
  const { getExpensesByUser, expenses } = useExpenseContext();
  const { user: userData, isSignedIn } = useUser();
  const [showAll, setShowAll] = React.useState(false);
  const router = useRouter();
  const [showBuyPremiumModal, setShowBuyPremiumModal] = React.useState(false);
  // REVIEW: CODE fot the user with expenses '9e683f71-8a18-4a91-a596-c956813405e9'
  if (!userData) {
    return null;
  }
  React.useEffect(() => {
    AnimatedRN.timing(fadeAnim, {
      toValue: showAll ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAll]);

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

  React.useEffect(() => {
    if (userData) {
      getExpensesByUser(userData.id);
    }
  }, [userData, getExpensesByUser, expenses]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
  }

  return (
    <View>
      {showAll ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <SafeAreaView
            style={{
              paddingTop: 14,
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            <YStack gap="$5">
              <XStack justifyContent="space-between" alignItems="center">
                <H3>Gastos Recientes</H3>
                <Text
                  onPress={() => {
                    setShowAll(false);
                  }}
                  pressStyle={{
                    opacity: 0.5,
                  }}
                >
                  Ver Menos
                </Text>
              </XStack>
              <ScrollView>
                <FlashList
                  data={expenses}
                  estimatedItemSize={50}
                  renderItem={({ item: expense }) => {
                    return <Expense expense={expense} />;
                  }}
                />
              </ScrollView>
            </YStack>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            paddingTop="$10"
            // bg="$green9Light" TODO: change color to yellow bg="yellow10Light"
            bg="$green9Light"
            borderBottomStartRadius={14}
            borderBottomEndRadius={14}
          >
            <XStack
              style={{ paddingHorizontal: 16 }}
              justifyContent="space-between"
              mx={4}
            >
              <YStack>
                <Text>
                  {capitalizeFirstLetter(
                    new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  )}
                </Text>
                <Text fontWeight="bold">Hola, {userData?.firstName} 👋</Text>
              </YStack>
              <BuyPremiumModal
                setOpenModal={setShowBuyPremiumModal}
                openModal={showBuyPremiumModal}
              />
              <Button
                onPress={() => {
                  setShowBuyPremiumModal(true);
                }}
                size="$3.5"
                bg="$green5Light"
                pressStyle={{
                  opacity: 0.5,
                }}
                circular
                icon={<Lock size="$1" />}
              />
            </XStack>

            <View style={{ height: 150 }} />

            <Card />
          </View>
          <ScrollView
            ref={scrollRef}
            style={{ paddingHorizontal: 5, zIndex: -10 }}
          >
            <YStack gap="$4" paddingBottom="$5">
              <XStack
                paddingTop="$13"
                paddingHorizontal="$4"
                justifyContent="space-between"
                alignItems="center"
              >
                <H4>Historial de Gastos</H4>

                <Text
                  onPress={() => {
                    setShowAll(true);
                  }}
                  pressStyle={{
                    opacity: 0.5,
                  }}
                >
                  Ver Todo
                </Text>
              </XStack>
              {expenses && expenses.length === 0 && (
                <YStack
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  minHeight="100%"
                >
                  <Spinner size="small" />
                  <Text color="$gray10">Cargando...</Text>
                </YStack>
              )}

              <FlashList
                data={expenses}
                estimatedItemSize={50}
                renderItem={({ item: expense }) => (
                  <Expense expense={expense} />
                )}
              />
            </YStack>
          </ScrollView>
          <Animated.View
            style={[
              buttonStyle,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              },
            ]}
          >
            <Button
              style={{ borderRadius: 20, padding: 10 }}
              onPress={scrollToTop}
            >
              <ChevronUp />
            </Button>
          </Animated.View>
        </>
      )}
    </View>
  );
}
