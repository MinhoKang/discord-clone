import { NextApiResponeServerIo } from "@/types";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponeServerIo) => {
  try {
    if (!res.socket.server.io) {
      const path = "/api/socket/io";
      console.log("Socket.io server is initializing...");
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
        path: path,
        addTrailingSlash: false,
      });
      res.socket.server.io = io;
      console.log("Socket.io server initialized successfully.");
    } else {
      console.log("Socket.io server already initialized.");
    }

    res.end();
  } catch (error) {
    console.error("Error in ioHandler:", error);
    res.status(500).end("Internal Server Error");
  }
};

export default ioHandler;
