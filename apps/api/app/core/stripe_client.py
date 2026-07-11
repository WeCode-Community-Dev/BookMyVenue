"""Single configured Stripe client.

Importing `stripe` from here guarantees the API key is set once, and gives tests
a single place to monkeypatch the SDK.
"""

import stripe

from app.core.config import settings

stripe.api_key = settings.stripe_secret_key


def get_stripe():
    return stripe
