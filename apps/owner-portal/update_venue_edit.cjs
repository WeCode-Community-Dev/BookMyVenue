const fs = require('fs');
let code = fs.readFileSync('./src/pages/venues/VenueEdit.tsx', 'utf8');

const replacements = {
  'name="min_capacity"': 'name="min_capacity" min={1}',
  'name="max_capacity"': 'name="max_capacity" min={1}',
  'name="address_line1"': 'name="address_line1" required',
  'name="city"': 'name="city" required',
  'name="state"': 'name="state" required',
  'name="country"': 'name="country" required',
  'name="base_price"': 'name="base_price" min={0} required={allowFullDay}',
  'name="hourly_rate"': 'name="hourly_rate" min={0} required={allowTimeSlot}',
  'name="advance_pct"': 'name="advance_pct" min={0.01} max={100} required',
  'name="balance_due"': 'name="balance_due" min={1} required',
  'name="min_booking_duration_minutes"': 'name="min_booking_duration_minutes" min={1} required',
  'name="max_booking_duration_minutes"': 'name="max_booking_duration_minutes" min={1} required',
  'name="slot_interval_minutes"': 'name="slot_interval_minutes" min={1} required',
  'name="pre_buffer_minutes"': 'name="pre_buffer_minutes" min={0} required',
  'name="post_buffer_minutes"': 'name="post_buffer_minutes" min={0} required',
  'name="owner_action_window_hours"': 'name="owner_action_window_hours" required',
  'name="open_time"': 'name="open_time" required',
  'name="close_time"': 'name="close_time" required',
  'name="tier_1_hours"': 'name="tier_1_hours" min={1}',
  'name="tier_2_hours"': 'name="tier_2_hours" min={1}',
  'name="tier_3_hours"': 'name="tier_3_hours" min={1}',
  'name="no_show_refund_pct"': 'name="no_show_refund_pct" required',
  'name="overdue_advance_refund_pct"': 'name="overdue_advance_refund_pct" required'
};

for (const [key, value] of Object.entries(replacements)) {
  if (code.includes(value)) continue;
  code = code.replace(key, value);
}

code = code.replace('<select name="pricing_mode" defaultValue={venue.pricing_mode}', '<select name="pricing_mode" defaultValue={venue.pricing_mode} required');

fs.writeFileSync('./src/pages/venues/VenueEdit.tsx', code);
