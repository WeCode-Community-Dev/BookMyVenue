from apscheduler.schedulers.background import BackgroundScheduler

from app.jobs import (
    balance_overdue,
    booking_completion,
    hold_expiry,
    invoice_generator,
    payment_pending_expiry,
    payment_reminders,
    search_indexer,
    stale_requests,
)

scheduler = BackgroundScheduler()


def start():
    scheduler.add_job(
        payment_pending_expiry.run, "interval", minutes=1, id="payment_pending_expiry"
    )
    scheduler.add_job(invoice_generator.run, "interval", minutes=1, id="invoice_generator")
    scheduler.add_job(hold_expiry.run, "interval", hours=1, id="hold_expiry")
    scheduler.add_job(stale_requests.run, "interval", hours=6, id="stale_requests")
    # Hourly so the 12h pre-hold-expiry reminder window is reliably caught.
    scheduler.add_job(payment_reminders.run, "interval", hours=1, id="payment_reminders")
    scheduler.add_job(booking_completion.run, "cron", hour=0, id="booking_completion")
    scheduler.add_job(balance_overdue.run_flag, "interval", hours=6, id="balance_overdue_flag")
    scheduler.add_job(
        balance_overdue.run_autocancel, "interval", hours=6, id="balance_overdue_autocancel"
    )
    scheduler.add_job(search_indexer.run, "interval", hours=1, id="search_indexer")
    scheduler.start()


def shutdown():
    if scheduler.running:
        scheduler.shutdown(wait=False)
