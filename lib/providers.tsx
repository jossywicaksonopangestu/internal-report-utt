'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {App as AntdApp, ConfigProvider} from 'antd';
import {useState} from 'react';
import StyledComponentsRegistry from './antd-registry';

export default function Providers({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <StyledComponentsRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#6168FF',
              fontFamily: 'var(--font-manrope)',
            },
            components: {
              Table: {
                colorBgContainer: 'transparent',
                colorTextHeading: '#ffffff',
                colorText: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                headerBg: 'rgba(255, 255, 255, 0.1)',
                headerSplitColor: 'transparent',
                rowHoverBg: 'rgba(255, 255, 255, 0.08)',
                headerBorderRadius: 12,
                rowSelectedBg: 'rgba(0, 0, 0, 0.1)',
                rowSelectedHoverBg: 'rgba(0, 0, 0, 0.15)',
              },
              Pagination: {
                colorText: '#ffffff',
                colorPrimary: '#ffffff',
                itemActiveBg: 'rgba(255, 255, 255, 0.2)',
              },
              Modal: {
                titleFontSize: 20,
                headerBg: '#ffffff',
              },
              Checkbox: {
                colorPrimary: '#293038',
              },
            },
          }}
        >
          <AntdApp
            notification={{
              placement: 'topRight',
            }}
          >
            {children}
          </AntdApp>
        </ConfigProvider>
      </QueryClientProvider>
    </StyledComponentsRegistry>
  );
}
