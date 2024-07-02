import SingleNotification from "@/components/popups/notification";
import { INotification } from "@/interfaces/notification";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useToastController } from "@tamagui/toast";
import * as React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "tamagui";
import { useUser } from "@clerk/clerk-expo";

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const { user: userData } = useUser();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();

  const getNotifications = async () => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("usuario_id", userData?.id);

    if (error) {
      toast.show("Error al recuperar notificaciones");
      return;
    }
    setNotifications(data);
  };

  React.useEffect(() => {
    getNotifications();
  }, [notifications]);

  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <FlashList
        data={notifications}
        renderItem={({ item }) => <SingleNotification notification={item} />}
        estimatedItemSize={20}
      />
    </ScrollView>
  );
}
