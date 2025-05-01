import { REVIEW_SCORE_SUMMARY_LABELS } from "../../config";

export function getReviewSummary(score) {
  return REVIEW_SCORE_SUMMARY_LABELS[Math.ceil(score)];
}
