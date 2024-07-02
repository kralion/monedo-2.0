import Chart from "@/components/statistics/chart";
import { Expense } from "@/components/statistics/expense";
import { useExpenseContext } from "@/context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileLineChart,
} from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Adapt,
  Button,
  H2,
  ScrollView,
  Select,
  Sheet,
  Text,
  XStack,
  YStack,
} from "tamagui";
const items = [
  { name: "Top Gastos" },
  { name: "Periódicos" },
  { name: "Recientes" },
];

const FilterSlider = ({ value }: { value: string }) => {
  return (
    <Button
      borderRadius="$10"
      mr="$2"
      width="$8"
      // bg="$accentColor"
      bg="$green9Light"
      size="$3"
      color="$white1"
    >
      {value}
    </Button>
  );
};
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

  const queryFilters = [
    { value: "diario", label: "Diario" },
    { value: "semanal", label: "Semanal" },
    { value: "mensual", label: "Mensual" },
    { value: "hoy", label: "Hoy" },
  ];

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
        <>
          <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <YStack gap="$3">
              <XStack alignItems="center" justifyContent="space-between">
                <H2>Estadísticas</H2>
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
              <FlashList
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 100,
                }}
                data={queryFilters}
                renderItem={({ item }) => <FilterSlider value={item.value} />}
                estimatedItemSize={16}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <Chart timelineQuery={timelineQuery} />
              <XStack alignItems="center" justifyContent="space-between">
                <Link asChild href="/(modals)/export-data">
                  <TouchableOpacity>
                    <FileLineChart size="$2" />
                  </TouchableOpacity>
                </Link>
                <YStack>
                  <Select disablePreventBodyScroll>
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Recientes" />
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
                                    <Select.ItemText>
                                      {item.name}
                                    </Select.ItemText>
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
            </YStack>
          </SafeAreaView>
          <ScrollView>
            <YStack paddingBottom="$5">
              <FlashList
                data={expenses}
                renderItem={({ item: expense }) => {
                  return <Expense expense={expense} />;
                }}
                estimatedItemSize={16}
              />
            </YStack>
          </ScrollView>
        </>
      )}
    </>
  );
}
