import { toastStore } from "./stores";
import type { IToast } from "./stores";


export function createToast(toast: Omit<IToast, "id">) {
  const toast2: IToast = {...toast, id: Date.now().toString(36) + Math.random().toString(36).substring(2)};
  toastStore.update((state) =>  [toast2, ...state])
}
