/**
 * Status of a venue verification request submission.
 * Each submission is a separate row — history is fully preserved.
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
}
