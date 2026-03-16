import {App} from 'antd';
import {useCallback, useMemo} from 'react';

type NotificationKind = 'success' | 'error' | 'info' | 'warning';

export function useAppNotification() {
  const {notification} = App.useApp();

  const notify = useCallback(
    (kind: NotificationKind, title: string, description: string) => {
      notification[kind]({
        title: title,
        description,
        placement: 'topRight',
      });
    },
    [notification],
  );

  return useMemo(
    () => ({
      success: (title: string, description: string) =>
        notify('success', title, description),
      error: (title: string, description: string) =>
        notify('error', title, description),
      info: (title: string, description: string) =>
        notify('info', title, description),
      warning: (title: string, description: string) =>
        notify('warning', title, description),
    }),
    [notify],
  );
}
