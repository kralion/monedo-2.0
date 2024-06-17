import { Expense } from "@/components/shared";
import { useExpenseContext } from "@/context/ExpenseContext";
import { IGasto } from "@/interfaces";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Animated, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chart from "@/components/estadisticas/chart";
import { Button, XStack, YStack, Text } from "tamagui";
import { Select } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

export default function Statistics() {
  const [queryType, setQueryType] = useState("recientes");
  const [timelineQuery, setTimelineQuery] = useState("semanal");
  const [expenses, setExpenses] = useState<IGasto[]>([]);
  const { getTopExpenses, getRecentExpenses, getExpensesByPeriodicity } =
    useExpenseContext();
  const [showAll, setShowAll] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const fetchRecentExpenses = async () => {
    const expenses = await getRecentExpenses();
    setExpenses(expenses);
  };
  const fetchTopExpenses = async () => {
    const expenses = await getTopExpenses();
    setExpenses(expenses);
  };
  const fetchExpensesByPeriodicity = async () => {
    const expenses = await getExpensesByPeriodicity();
    setExpenses(expenses);
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
        <Animated.View style={{ opacity: fadeAnim, backgroundColor: "white" }}>
          <SafeAreaView>
            <XStack space={4} justifyContent="space-between" px={4} my={7}>
              <Text className="text-xl text-muted font-semibold">
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
                <MaterialCommunityIcons
                  name="arrow-collapse"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </XStack>
            <FlatList
              data={expenses}
              renderItem={({ item }) => <Expense expense={item} />}
              keyExtractor={(item) => String(item.id)}
            />
          </SafeAreaView>
        </Animated.View>
      ) : (
        <SafeAreaView style={{ backgroundColor: "white" }}>
          <YStack space={4}>
            <Text className="font-bold text-center text-2xl">Estadísticas</Text>
            <XStack space={1.5} mx={1.5}>
              <Button
                variant="outlined"
                className="py-2.5 w-[90px]"
                borderRadius={10}
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
                  icon={
                    <Image
                      style={{ width: 16, height: 16, tintColor: "#ffff" }}
                      source={{
                        uri: "https://api.iconify.design/mingcute:file-export-line.svg",
                      }}
                      alt="exportar"
                    />
                  }
                  borderRadius={10}
                >
                  Exportar
                </Button>
              </Link>
              <Select>
                <Select.Viewport
                  animation="quick"
                  animateOnly={["transform", "opacity"]}
                  enterStyle={{ o: 0, y: -10 }}
                  exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Fruits</Select.Label>

                    <Select.Item index={0} value="top-gastos">
                      <Select.ItemText>Top Gastos</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item index={1} value="periódicos">
                      <Select.ItemText>Periódicos</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item index={2} value="recientes">
                      <Select.ItemText>Recientes</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Group>
                </Select.Viewport>
              </Select>
            </XStack>
            <XStack space={4} justifyContent="space-between" px={4}>
              <Text className="text-xl text-muted font-semibold">
                {queryType === "recientes"
                  ? "Recientes"
                  : queryType === "top-gastos"
                  ? "Top Gastos"
                  : "Periódicos"}
              </Text>
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
            <FlatList
              data={expenses}
              keyExtractor={(expense) => String(expense.id)}
              renderItem={({ item: expense }) => <Expense expense={expense} />}
            />
          </YStack>
        </SafeAreaView>
      )}
    </>
  );
}
