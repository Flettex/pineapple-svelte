import type { IChannel, IGuild, IMessage, IUser } from "./types";

export const MAIN_GUILD: IGuild = {
  id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
  name: "Main",
  created_at: 0,
  creator_id: -1,
  channels: [],
  members: [],
};

export const MAIN_CHANNEL: IChannel = {
  id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
  name: "Main",
  position: -1,
  created_at: 0,
  guild_id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
};

export const SYSTEM_AUTHOR: IUser = {
  id: BigInt(0),
  username: "System",
  created_at: 1467969011,
  is_staff: true,
  is_superuser: true,
};

export function sysmsg(content: string, id: string): IMessage {
  return {
    id: "",
    content: content,
    created_at: 0,
    edited_at: 0,
    channel_id: id,
    author: SYSTEM_AUTHOR,
    nonce: "",
  };
}
