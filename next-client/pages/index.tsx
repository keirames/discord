import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Auth } from '../src/modules/auth/auth';
import { LayerContainer } from '../src/modules/layer/layer-container';

export default function Home() {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[100vh] w-full items-center justify-center bg-zinc-700">
        <Auth />
        <LayerContainer />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
