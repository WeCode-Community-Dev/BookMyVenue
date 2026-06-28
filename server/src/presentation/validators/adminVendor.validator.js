import { z } from "zod"
import { VendorApprovalStatus } from '../../domain/enums/VendorApprovalStatus.enum.js'

export const getAllVendorsQuerySchema =
    z.object({

        search:
            z.string().optional(),

        status:
            z.nativeEnum(VendorApprovalStatus)
                .optional(),

        page:
            z.coerce.number()
                .min(1)
                .default(1),

        limit:
            z.coerce.number()
                .min(1)
                .default(10)
    })

export const rejectVendorBodySchema = z.object({
    reason: z
        .string()
        .trim()
        .min(1, "Rejection reason is required")
});

export const updateVendorStatusSchema = z.object({

    isBlocked: z.boolean()

});