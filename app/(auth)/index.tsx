import { useRouter } from "expo-router";
import { Button, Card, H4, Image, Paragraph, YStack } from "tamagui";

export default function Welcome() {
  const router = useRouter();
  return (
    <Card width="100%" py="$10" px="$5" alignItems="center" height="100%">
      <Image
        source={require("./../../assets/images/hero.png")}
        width={"100%"}
        height={"50%"}
      />
      <Card.Footer mt="$10">
        <YStack
          gap="$4"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
        >
          <H4>Controla tus gastos</H4>
          <Paragraph textAlign="center">
            La mejor solución para controlar los gastos que realizas en tu día a
            día, sin pederte de nada.
          </Paragraph>

          <Button
            onPress={() => router.push("/(auth)/sign-up")}
            size="$5"
            bg="$green8Light"
            color="$white1"
          >
            Empezar
          </Button>
        </YStack>
      </Card.Footer>
    </Card>
  );
}
