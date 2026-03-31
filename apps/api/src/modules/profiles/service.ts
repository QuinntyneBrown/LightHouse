import type { PrismaClient, AgeBand } from "@prisma/client";
import { NotFoundError, ForbiddenError } from "../../utils/errors.js";
import type { CreateProfileInput, UpdateProfileInput } from "./schema.js";

export class ProfileService {
  constructor(private prisma: PrismaClient) {}

  async listProfiles(accountId: string) {
    const profiles = await this.prisma.childProfile.findMany({
      where: { accountId },
      include: { avatar: true },
      orderBy: { createdAt: "asc" },
    });
    return profiles.map(this.formatProfile);
  }

  async createProfile(accountId: string, input: CreateProfileInput) {
    const profile = await this.prisma.childProfile.create({
      data: {
        accountId,
        name: input.name,
        birthDate: new Date(input.birthDate),
        ageBand: input.ageBand as AgeBand,
        avatarId: input.avatarId,
      },
      include: { avatar: true },
    });
    return this.formatProfile(profile);
  }

  async getProfile(accountId: string, profileId: string) {
    const profile = await this.prisma.childProfile.findFirst({
      where: { id: profileId, accountId },
      include: { avatar: true },
    });
    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }
    return this.formatProfile(profile);
  }

  async updateProfile(accountId: string, profileId: string, input: UpdateProfileInput) {
    const profile = await this.prisma.childProfile.findFirst({
      where: { id: profileId, accountId },
    });
    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }

    const updated = await this.prisma.childProfile.update({
      where: { id: profileId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.birthDate !== undefined && { birthDate: new Date(input.birthDate) }),
        ...(input.ageBand !== undefined && { ageBand: input.ageBand as AgeBand }),
        ...(input.avatarId !== undefined && { avatarId: input.avatarId }),
      },
      include: { avatar: true },
    });
    return this.formatProfile(updated);
  }

  async deleteProfile(accountId: string, profileId: string) {
    const profile = await this.prisma.childProfile.findFirst({
      where: { id: profileId, accountId },
    });
    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }

    await this.prisma.childProfile.delete({ where: { id: profileId } });
  }

  async activateProfile(accountId: string, profileId: string) {
    const profile = await this.prisma.childProfile.findFirst({
      where: { id: profileId, accountId },
    });
    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }

    // Deactivate all others, activate this one
    await this.prisma.$transaction([
      this.prisma.childProfile.updateMany({
        where: { accountId },
        data: { isActive: false },
      }),
      this.prisma.childProfile.update({
        where: { id: profileId },
        data: { isActive: true },
      }),
    ]);

    return { profileId, isActive: true };
  }

  async listAvatars() {
    return this.prisma.avatar.findMany({
      orderBy: { name: "asc" },
    });
  }

  private formatProfile(profile: any) {
    return {
      id: profile.id,
      name: profile.name,
      birthDate: profile.birthDate.toISOString().split("T")[0],
      ageBand: profile.ageBand,
      avatar: profile.avatar
        ? {
            id: profile.avatar.id,
            name: profile.avatar.name,
            icon: profile.avatar.icon,
            color: profile.avatar.color,
          }
        : null,
      isActive: profile.isActive,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
