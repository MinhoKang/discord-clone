import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponeServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponeServerIo) => {
  console.log("object");
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ message: "Unauthorized" });

    if (!channelId)
      return res.status(401).json({ message: "channel Id Missing" });

    if (!serverId)
      return res.status(401).json({ message: "Server Id Missing" });

    if (!content) return res.status(401).json({ message: "content Missing" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) return res.status(404).json({ message: "Server Not Found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(404).json({ message: "Channel Not Found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(404).json({ message: "Member Not Found" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    console.log("channelKey", channelKey);

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
