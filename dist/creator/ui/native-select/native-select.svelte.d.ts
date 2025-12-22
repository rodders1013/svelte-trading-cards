import { type WithElementRef } from "../utils.js";
import type { HTMLSelectAttributes } from "svelte/elements";
declare const NativeSelect: import("svelte").Component<WithElementRef<HTMLSelectAttributes>, {}, "value" | "ref">;
type NativeSelect = ReturnType<typeof NativeSelect>;
export default NativeSelect;
