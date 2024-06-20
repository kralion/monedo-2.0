import SingleNotification from "@/components/popups/notification";
import { useAuth } from "@/context";
import { INotification } from "@/interfaces/notification";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useToastController } from "@tamagui/toast";
import * as React from "react";

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const { userData } = useAuth();
  const toast = useToastController();

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
    <FlashList
      data={notifications}
      renderItem={({ item }) => <SingleNotification notification={item} />}
      estimatedItemSize={20}
    />
  );
}
