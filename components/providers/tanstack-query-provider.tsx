"use client";

import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) =>
            toast.error(`Something went wrong: ${error.message}`),
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
}
