export interface IMessage {
  id: string;
  content: string;
  created_at: number;
  edited_at: number;
  author: IUser;
  channel_id: string;
  nonce?: string;
}

export interface IChannel {
  id: string; // uuid
  name: string;
  description?: string;
  position: number;
  created_at: number; // number
  guild_id?: string; // uuid, useless but too lazy to remove it
  channel_type: number,
  user1?: bigint,
  user2?: bigint
}

export interface IUser {
  id: bigint;
  username: string;
  profile?: string;
  created_at: number; // time
  description?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface IMember {
  id: string;
  nick_name: string | undefined;
  join_at: number;
  guild_id: string;
  user_id: number;
  user: IUser;
}

export interface IGuild {
  id: string; // uuid
  name: string;
  description?: string;
  icon?: string;
  created_at: number; // time
  creator_id: number;
  channels: IChannel[];
  members: IMember[];
}

export interface IUserData {
  user: {
    id: bigint;
    username: string;
    email: string;
    profile?: string;
    created_at: number; // time
    description?: string;
    allow_login: boolean;
    is_staff: boolean;
    is_superuser: boolean;
  };
  guilds: IGuild[];
  dms: IChannel[]
}
