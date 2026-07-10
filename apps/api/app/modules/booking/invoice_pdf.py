"""Invoice PDF content generation + storage — no DB/queue awareness.

Pure functions: given a Booking (with venue/user/slot eager-loaded), produce
PDF bytes and upload them. Called from app.modules.booking.invoice's job
processing; kept separate because "render a document" and "orchestrate a
retryable background job" are different concerns.
"""

import io
import uuid


def generate_pdf(booking) -> bytes:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    venue = booking.venue
    customer = booking.user
    slot = booking.slot

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=24 * mm, bottomMargin=24 * mm)
    styles = getSampleStyleSheet()
    story = [
        Paragraph('Venue<font color="#408A71">404</font>', styles["Title"]),
        Paragraph(f"Invoice — Booking #{str(booking.id)[:8].upper()}", styles["Heading2"]),
        Spacer(1, 14),
    ]

    info_rows = [
        ["Venue", venue.name if venue else "—"],
        ["Address", venue.address_line1 if venue else "—"],
        ["Customer", (customer.full_name if customer and customer.full_name else "—")],
        ["Event date", slot.starts_at.strftime("%d %b %Y") if slot else "—"],
        ["Guests", str(booking.guest_count)],
        [
            "Payment date",
            booking.confirmed_at.strftime("%d %b %Y, %I:%M %p") if booking.confirmed_at else "—",
        ],
    ]
    info_table = Table(info_rows, colWidths=[110 * mm / 2.6, 110 * mm])
    info_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#71717a")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(info_table)
    story.append(Spacer(1, 20))

    amount_rows = [
        ["Description", "Amount (INR)"],
        ["Quoted price", f"Rs. {booking.quoted_price_paise / 100:,.2f}"],
    ]
    amount_rows.append(["Amount paid", f"Rs. {booking.amount_paid_paise / 100:,.2f}"])
    if booking.balance_due_paise:
        amount_rows.append(["Balance due", f"Rs. {booking.balance_due_paise / 100:,.2f}"])

    amounts_table = Table(amount_rows, colWidths=[130 * mm, 60 * mm])
    amounts_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#285A48")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("GRID", (0, 1), (-1, -1), 0.5, colors.HexColor("#f4f4f5")),
            ]
        )
    )
    story.append(amounts_table)

    doc.build(story)
    return buf.getvalue()


def upload_pdf_to_cloudinary(pdf_bytes: bytes, booking_id: uuid.UUID) -> str:
    import cloudinary.uploader

    result = cloudinary.uploader.upload(
        pdf_bytes,
        folder="venue404/invoices",
        # No ".pdf" here — Cloudinary appends the format extension to the
        # public_id itself, so including it yields "invoice_<id>.pdf.pdf".
        public_id=f"invoice_{booking_id}",
        resource_type="auto",
        overwrite=True,
    )
    return result["secure_url"]
