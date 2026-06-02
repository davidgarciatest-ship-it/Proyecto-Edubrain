import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }

  if (final !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return true;
}

export async function scheduleReminder(
  id: number,
  title: string,
  scheduledTime: string,
  repeatDays: number[] | null
): Promise<string | undefined> {
  const [hours, minutes] = scheduledTime.split(':').map(Number);

  if (repeatDays && repeatDays.length > 0) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'EduBrain',
        body: title,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: repeatDays[0] + 1,
        hour: hours,
        minute: minutes,
      },
    });
    return identifier;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'EduBrain',
      body: title,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });
  return identifier;
}

export async function cancelReminder(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
