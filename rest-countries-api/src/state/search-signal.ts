import { signal } from "@preact/signals";
import { Region } from "../types";

export const region = signal<Region>('all');
export const searchQuery = signal('');
export const title = signal('');