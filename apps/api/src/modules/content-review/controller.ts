import type { FastifyRequest, FastifyReply } from "fastify";
import type { ContentReviewService } from "./service.js";
import {
  submitReviewSchema,
  reviewDecisionSchema,
  reviewCommentSchema,
  reviewFilterSchema,
  reviewIdParam,
} from "./schema.js";

export class ContentReviewController {
  constructor(private service: ContentReviewService) {}

  submit = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = submitReviewSchema.parse(request.body);
    const result = await this.service.submitForReview(body, request.user.sub);
    return reply.status(201).send(result);
  };

  listPending = async (request: FastifyRequest, reply: FastifyReply) => {
    const filter = reviewFilterSchema.parse(request.query);
    const result = await this.service.listPending(filter);
    return reply.send(result);
  };

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const { reviewId } = reviewIdParam.parse(request.params);
    const review = await this.service.getReview(reviewId);
    return reply.send(review);
  };

  decide = async (request: FastifyRequest, reply: FastifyReply) => {
    const { reviewId } = reviewIdParam.parse(request.params);
    const body = reviewDecisionSchema.parse(request.body);
    const decision = await this.service.makeDecision(reviewId, request.user.sub, body);
    return reply.status(201).send(decision);
  };

  comment = async (request: FastifyRequest, reply: FastifyReply) => {
    const { reviewId } = reviewIdParam.parse(request.params);
    const body = reviewCommentSchema.parse(request.body);
    const comment = await this.service.addComment(reviewId, request.user.sub, body);
    return reply.status(201).send(comment);
  };
}
