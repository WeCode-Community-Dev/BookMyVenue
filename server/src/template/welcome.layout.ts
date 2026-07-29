import { emailLayout } from './email.layout';

export const welcomeEmail = (name: string) => ({
  subject: 'Welcome to BookMyVenue',

  html: emailLayout(
    'Welcome',
    "We're happy to have you",

    `
    <h2 style="color:white;">
        Hi ${name},
    </h2>

    <p style="color:#e2e8f0;">
        Welcome to BookMyVenue.

        We're excited to have you onboard.
    </p>
`
  ),
});
