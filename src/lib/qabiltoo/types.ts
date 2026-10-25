export interface Profile {
  id: string;
  fullName: string;
  gender: "male" | "female";
  age: number;
  height: string;
  city: string;
  state: string;
  education: string;
  profession: string;
  income: string | null;
  maritalStatus: string;
  sect: string | null;
  religiousLevel: string | null;
  namaz: string | null;
  about: string;
  partnerPreference: string | null;
  image: string;
  email: string | null;
  isDemo: boolean;
  createdAt: string;
}

export interface ProfilesResponse {
  profiles: Profile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProfileFilters {
  q?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  maritalStatus?: string;
  sect?: string;
  page?: number;
  limit?: number;
}

export interface StatsResponse {
  totalProfiles: number;
  maleCount: number;
  femaleCount: number;
  cities: number;
  cityNames: string[];
}

export interface InterestWithProfile {
  id: string;
  fromId: string;
  toId: string;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  from: Profile;
  to: Profile;
}

export interface InterestsResponse {
  sent: InterestWithProfile[];
  received: InterestWithProfile[];
}

export type View =
  | { name: "landing" }
  | { name: "browse"; gender?: string }
  | { name: "register" }
  | { name: "interests" }
  | { name: "profile"; id: string };

export const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed"] as const;
export const SECTS = ["Sunni", "Shia", "Just Muslim"] as const;
export const RELIGIOUS_LEVELS = ["Very Practicing", "Moderate", "Exploring"] as const;
export const NAMAZ_OPTIONS = ["5 times daily", "Regularly", "Sometimes", "Learning"] as const;

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Privacy-friendly display name: "Ayesha Siddiqui" -> "Ayesha S." */
export function displayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
