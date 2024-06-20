import { Expense } from "@/components/shared";
import { useExpenseContext } from "@/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chart from "@/components/estadisticas/chart";
import { Button, XStack, YStack, Text, H2, H4, Adapt } from "tamagui";
import { Select } from "tamagui";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileLineChart,
} from "@tamagui/lucide-icons";
import { FlashList } from "@shopify/flash-list";
import { Sheet } from "tamagui";
import { ScrollView } from "tamagui";
const items = [
  { name: "Top Gastos" },
  { name: "Periódicos" },
  { name: "Recientes" },
];
export default function Statistics() {
  const [queryType, setQueryType] = useState("recientes");
  const [timelineQuery, setTimelineQuery] = useState("semanal");
  const {
    getTopExpenses,
    getRecentExpenses,
    getExpensesByPeriodicity,
    expenses,
  } = useExpenseContext();
  const [showAll, setShowAll] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const fetchRecentExpenses = async () => {
    await getRecentExpenses();
  };
  const fetchTopExpenses = async () => {
    await getTopExpenses();
  };
  const fetchExpensesByPeriodicity = async () => {
    await getExpensesByPeriodicity();
  };
  React.useEffect(() => {
    if (queryType === "recientes") {
      fetchRecentExpenses();
    } else if (queryType === "top-gastos") {
      fetchTopExpenses();
    } else if (queryType === "periódicos") {
      fetchExpensesByPeriodicity();
    }
  }, [queryType]);
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showAll ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAll]);

  return (
    <>
      {showAll ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <XStack justifyContent="space-between">
              <Text>
                {queryType === "recientes"
                  ? "Recientes"
                  : queryType === "top-gastos"
                  ? "Top Gastos"
                  : "Periódicos"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAll(false);
                }}
              >
                <MaterialCommunityIcons name="arrow-collapse" size={24} />
              </TouchableOpacity>
            </XStack>
            <ScrollView>
              <FlashList
                data={expenses}
                renderItem={({ item }) => <Expense expense={item} />}
                estimatedItemSize={16}
              />
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <YStack gap="$4">
            <H2>Estadísticas</H2>
            <XStack gap="$2">
              <Button
                variant="outlined"
                onPress={() => setTimelineQuery("hoy")}
              >
                Hoy
              </Button>
              <Button
                variant="outlined"
                onPress={() => setTimelineQuery("diario")}
              >
                Diario
              </Button>
              <Button
                variant="outlined"
                onPress={() => setTimelineQuery("semanal")}
              >
                Semanal
              </Button>
              <Button
                variant="outlined"
                onPress={() => setTimelineQuery("mensual")}
              >
                Mensual
              </Button>
            </XStack>
            <Chart timelineQuery={timelineQuery} />
            <XStack alignItems="center" justifyContent="space-between">
              <Link asChild href="/(modals)/export-data">
                <Button
                  bg="$green8Light"
                  color="$white1"
                  href="/(modals)/export-data"
                  icon={FileLineChart}
                >
                  Exportar
                </Button>
              </Link>
              <YStack>
                <Select disablePreventBodyScroll>
                  <Select.Trigger iconAfter={ChevronDown}>
                    <Select.Value placeholder="Selecciona" />
                  </Select.Trigger>

                  <Adapt when="sm" platform="touch">
                    <Sheet modal dismissOnSnapToBottom>
                      <Sheet.Frame>
                        <Sheet.ScrollView>
                          <Adapt.Contents />
                        </Sheet.ScrollView>
                      </Sheet.Frame>
                      <Sheet.Overlay />
                    </Sheet>
                  </Adapt>

                  <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      width="100%"
                      height="$3"
                    >
                      <YStack zIndex={10}>
                        <ChevronUp size={20} />
                      </YStack>
                    </Select.ScrollUpButton>

                    <Select.Viewport>
                      <Select.Group>
                        {React.useMemo(
                          () =>
                            items.map((item, i) => {
                              return (
                                <Select.Item
                                  index={i}
                                  key={item.name}
                                  value={item.name.toLowerCase()}
                                >
                                  <Select.ItemText>{item.name}</Select.ItemText>
                                  <Select.ItemIndicator marginLeft="auto">
                                    <Check size={16} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              );
                            }),
                          [items]
                        )}
                      </Select.Group>
                    </Select.Viewport>

                    <Select.ScrollDownButton
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      width="100%"
                      height="$3"
                    >
                      <YStack zIndex={10}>
                        <ChevronDown size={20} />
                      </YStack>
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select>
              </YStack>
            </XStack>
            <XStack justifyContent="space-between">
              <H4>
                {queryType === "recientes"
                  ? "Recientes"
                  : queryType === "top-gastos"
                  ? "Top Gastos"
                  : "Periódicos"}
              </H4>
              <TouchableOpacity
                onPress={() => {
                  setShowAll(true);
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-expand"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </XStack>
          </YStack>
          <ScrollView mt="$4">
            <FlashList
              data={expenses}
              renderItem={({ item: expense }) => {
                return <Expense expense={expense} />;
              }}
              estimatedItemSize={16}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}
