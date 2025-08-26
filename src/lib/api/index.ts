// Single import point for pages/components.
// Switch to real services later without touching UI.
const useMock = import.meta.env.VITE_USE_MOCK === "true";

import * as mock from "@/mocks/profileApi";
// import * as real from "@/services/profileApi"; // when backend is ready

export const profileApi = useMock ? mock : mock; // swap to "real" later
export type { ProfileUser } from "@/mocks/profileApi";
