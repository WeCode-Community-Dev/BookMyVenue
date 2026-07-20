export class CreateReviewDto {
  readonly userId: string;
  readonly venueId: string;
  readonly rating: number;
  readonly comment: string;
}
