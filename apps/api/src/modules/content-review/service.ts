import type { PrismaClient, ReviewStatus } from "@prisma/client";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { parsePagination, paginatedResponse } from "../../utils/pagination.js";
import type {
  SubmitReviewInput,
  ReviewDecisionInput,
  ReviewCommentInput,
  ReviewFilterInput,
} from "./schema.js";

export class ContentReviewService {
  constructor(private prisma: PrismaClient) {}

  async submitForReview(input: SubmitReviewInput, submittedBy: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: input.contentId },
    });
    if (!content) throw new NotFoundError("Content", input.contentId);

    if (content.status !== "DRAFT" && content.status !== "APPROVED") {
      throw new ValidationError("Content must be in DRAFT or APPROVED status to submit for review");
    }

    const review = await this.prisma.$transaction(async (tx) => {
      await tx.content.update({
        where: { id: input.contentId },
        data: { status: "IN_REVIEW" },
      });

      return tx.reviewRequest.create({
        data: {
          contentId: input.contentId,
          submittedBy,
          status: "PENDING",
        },
        include: {
          content: true,
        },
      });
    });

    return this.formatReview(review);
  }

  async listPending(filter: ReviewFilterInput) {
    const { offset, limit } = parsePagination(filter);
    const where: any = {};
    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = "PENDING";
    }

    const [items, total] = await Promise.all([
      this.prisma.reviewRequest.findMany({
        where,
        include: {
          content: true,
          decisions: true,
          comments: true,
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.reviewRequest.count({ where }),
    ]);

    return paginatedResponse(items.map(this.formatReview), total, { offset, limit });
  }

  async getReview(reviewId: string) {
    const review = await this.prisma.reviewRequest.findUnique({
      where: { id: reviewId },
      include: {
        content: true,
        decisions: true,
        comments: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!review) throw new NotFoundError("ReviewRequest", reviewId);
    return this.formatReview(review);
  }

  async makeDecision(reviewId: string, reviewerId: string, input: ReviewDecisionInput) {
    const review = await this.prisma.reviewRequest.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundError("ReviewRequest", reviewId);

    if (review.status !== "PENDING") {
      throw new ValidationError("Review is not in PENDING status");
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const decision = await tx.reviewDecision.create({
        data: {
          reviewRequestId: reviewId,
          reviewerId,
          decision: input.decision as ReviewStatus,
          notes: input.notes,
          theologicalCheck: input.theologicalCheck,
          ageAppropriateness: input.ageAppropriateness,
          contentQuality: input.contentQuality,
        },
      });

      const newStatus = input.decision as ReviewStatus;
      await tx.reviewRequest.update({
        where: { id: reviewId },
        data: { status: newStatus },
      });

      // Update content status
      if (input.decision === "APPROVED") {
        await tx.content.update({
          where: { id: review.contentId },
          data: { status: "APPROVED" },
        });
      } else if (input.decision === "REJECTED") {
        await tx.content.update({
          where: { id: review.contentId },
          data: { status: "DRAFT" },
        });
      } else if (input.decision === "REVISION_REQUESTED") {
        await tx.content.update({
          where: { id: review.contentId },
          data: { status: "DRAFT" },
        });
      }

      return decision;
    });

    return result;
  }

  async addComment(reviewId: string, authorId: string, input: ReviewCommentInput) {
    const review = await this.prisma.reviewRequest.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundError("ReviewRequest", reviewId);

    return this.prisma.reviewComment.create({
      data: {
        reviewRequestId: reviewId,
        authorId,
        body: input.body,
      },
    });
  }

  private formatReview(review: any) {
    return {
      id: review.id,
      contentId: review.contentId,
      contentTitle: review.content?.title ?? null,
      submittedBy: review.submittedBy,
      status: review.status,
      decisions: review.decisions ?? [],
      comments: review.comments ?? [],
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}
