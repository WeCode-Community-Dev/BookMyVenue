import { z } from "zod";

import { PaymentStatus } from "../../domain/enums/Payment.enum.js";
import { PaymentMethod } from "../../domain/enums/PaymentMethod.enum.js";
import { PaymentType } from "../../domain/enums/PaymentType.enum.js";

export const adminGetAllPaymentsSchema = z.object({

    search: z.string().optional(),

    paymentStatus:

        z.enum(Object.values(PaymentStatus))

            .optional(),

    paymentMethod:

        z.enum(Object.values(PaymentMethod))

            .optional(),

    paymentType:

        z.enum(Object.values(PaymentType))

            .optional(),

sortBy: z
    .enum(["asc", "desc"])
    .default("desc"),


    page:

        z.coerce.number()

            .min(1)

            .default(1),

    limit:

        z.coerce.number()

            .min(1)

            .max(100)

            .default(10)

});

export const adminGetPaymentByIdSchema = z.object({

    paymentId:

        z.string()

           

});