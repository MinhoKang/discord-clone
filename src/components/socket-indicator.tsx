"use client";

import { useSocket } from "./providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  console.log(isConnected);
  // TODO:false로 나오는 문제
  if (!isConnected) {
    return (
      <Badge
        className="bg-yellow-600 text-white border-none"
        variant={"outline"}
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      className="bg-emerald-600 text-white border-none"
      variant={"outline"}
    >
      Live: Real-tile updates
    </Badge>
  );
};
