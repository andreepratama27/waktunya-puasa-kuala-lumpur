import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMemo } from "react";

const getConvexUrl = () => {
  // Netlify/Vite: expects VITE_CONVEX_URL
  const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
  return url?.trim() || null;
};

export const useConvexUrl = () => getConvexUrl();

export function OptionalConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const convexUrl = getConvexUrl();

  const client = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
