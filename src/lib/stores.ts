import { writable } from 'svelte/store';

export interface IToast {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    icon?: string;
    delay?: number;
}

export const toastStore = writable<IToast[]>([]);
