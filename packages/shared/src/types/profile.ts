export interface ChildProfileResponse {
  id: string;
  name: string;
  birthDate: string;
  ageBand: string;
  avatar: AvatarResponse | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  name: string;
  birthDate: string;
  ageBand: "BABY" | "TODDLER" | "PRESCHOOL" | "EARLY_READER";
  avatarId?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  birthDate?: string;
  ageBand?: "BABY" | "TODDLER" | "PRESCHOOL" | "EARLY_READER";
  avatarId?: string;
}

export interface AvatarResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
}
