import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense } from "@/interfaces";
import { router } from "expo-router";
import { Image } from "react-native";
import { H4, ListItem, Text } from "tamagui";
export function Expense({ expense }: { expense: IExpense }) {
  const { categoria, monto, fecha } = expense;
  const formattedDate = fecha
    ? formatDate(new Date(fecha))
    : "No date provided";
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.categoria
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";
  return (
    <ListItem
      onPress={() => {
        console.log("Expense clicked", expense.id);
        router.push(`/(expenses)/details/${expense.id}`);
      }}
      pressStyle={{
        bg: "$white6",
      }}
      bg="$colorTransparent"
      borderRadius={10}
      mb={12}
      title={
        <Text fontSize="$6" fontWeight="700">
          {categoria}
        </Text>
      }
      icon={
        <Image
          width={40}
          height={40}
          source={{
            uri: assetIndentificador,
          }}
        />
      }
      subTitle={formattedDate}
      iconAfter={
        <Text fontSize="$6" fontWeight="bold" color="$red10">
          - S/. {monto}
        </Text>
      }
    />
  );
}
