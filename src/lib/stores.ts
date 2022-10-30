import { writable } from "svelte/store";
import { MAIN_CHANNEL, MAIN_GUILD, SYSTEM_AUTHOR } from "./constants";
import type { IChannel, IGuild, IMessage, IUser, IUserData } from "./types";

export interface IToast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  icon?: string;
  delay?: number;
}

export const socket = writable<WebSocket | null>(null);

export const toastStore = writable<IToast[]>([]);

export const selectedGuild = writable<IGuild>(MAIN_GUILD);

export const selectedChannel = writable<IChannel>(MAIN_CHANNEL);

export const userData = writable<IUserData | null>(null);

export const userCache = writable<{ [key: string]: IUser }>({
  "0": SYSTEM_AUTHOR,
});

export const logs = writable<{ [key: string]: IMessage[] }>({});
