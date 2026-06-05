import { z } from 'zod';

export const signupSchema = z.object({

   accountType: z.enum([
      'USER',
      'OWNER'
   ]),

   name: z.string().min(3),

   email: z.email(),

   phone: z.string(),

   password: z.string().min(8),

   venue: z.object({

      name: z.string(),

      type: z.enum([
         'AUDITORIUM',
         'BANQUET_HALL',
         'CAFE',
         'RESTAURANT',
         'CONFERENCE_ROOM',
         'STUDIO',
         'OUTDOOR_SPACE',
         'OTHER'
      ]),

      city: z.string()

   }).optional()

}).superRefine((data, ctx) => {

   if (
      data.accountType === 'OWNER' &&
      !data.venue
   ) {

      ctx.addIssue({
         code: 'custom',
         message:
            'Venue details are required',
         path: ['venue']
      });

   }

});