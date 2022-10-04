import { toastStore } from "./stores";
import type { IToast } from "./stores";


export function createToast(toast: IToast) {
    toast.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    toastStore.update((state) =>  [toast as IToast, ...state])
  }
