import { prisma } from "@bookmyvenue/database";
import { ReviewStatus } from "@bookmyvenue/types";

export const getVenueReviewStatusService = async (
    venueId: number,
    userId?: string,
): Promise<ReviewStatus> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!userId) return "NOT_LOGGED_IN";

    const booking = await prisma.booking.findFirst({
        where: {
            venueId,
            userId,
            bookingSessions: { some: { eventDate: { lt: today } } },
        },
        select: { id: true },
    });

    if (!booking) return "NO_BOOKING";

    const review = await prisma.review.findFirst({
        where: { venueId, userId },
        select: { id: true },
    });

    if (review) return "ALREADY_REVIEWED";

    return "CAN_REVIEW";
};
