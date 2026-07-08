import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link } from 'react-router-dom'
import { Card, SectionHeader, Button, Input, Skeleton, Modal, DatePicker, Select, InfoTooltip } from '@venue404/ui'
import { Loader2, Save, Trash2, Pencil, ArrowLeft, Tag, Sparkles, Settings, List } from 'lucide-react'
import { TimeSelect } from '../../components/TimeSelect'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { Venue, PricingRule, PricingPreview } from '@venue404/api-client'
import { confirmAction } from '../../lib/confirm'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface RuleFormState {
  name: string
  days_of_week: number[]
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  adjustment_pct: string
  applies_to: 'full_day' | 'time_slot' | 'both'
  priority: string
  is_active: boolean
}

const emptyForm: RuleFormState = {
  name: '',
  days_of_week: [],
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  adjustment_pct: '',
  applies_to: 'both',
  priority: '50',
  is_active: true,
}

function ruleToFormState(rule: PricingRule): RuleFormState {
  const pct = rule.multiplier != null ? Math.round((rule.multiplier - 1) * 100) : 0
  return {
    name: rule.name,
    days_of_week: rule.days_of_week ?? [],
    start_date: rule.start_date ?? '',
    end_date: rule.end_date ?? '',
    start_time: rule.start_time ? rule.start_time.slice(0, 5) : '',
    end_time: rule.end_time ? rule.end_time.slice(0, 5) : '',
    adjustment_pct: String(pct),
    applies_to: rule.applies_to,
    priority: String(rule.priority),
    is_active: rule.is_active,
  }
}

function formToPayload(form: RuleFormState) {
  const pct = Number(form.adjustment_pct)
  return {
    name: form.name,
    days_of_week: form.days_of_week.length ? form.days_of_week : null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
    start_time: form.start_time ? (form.start_time.split(':').length === 2 ? `${form.start_time}:00` : form.start_time) : null,
    end_time: form.end_time ? (form.end_time.split(':').length === 2 ? `${form.end_time}:00` : form.end_time) : null,
    adjustment_type: 'multiplier',
    multiplier: 1 + pct / 100,
    amount_paise: null,
    applies_to: form.applies_to,
    priority: Number(form.priority) || 0,
    is_active: form.is_active,
  }
}

function RuleForm({
  form, setForm, onSubmit, submitting, submitLabel,
}: {
  form: RuleFormState
  setForm: (f: RuleFormState) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
  submitLabel: string
}) {
  const toggleDay = (d: number) => {
    setForm({
      ...form,
      days_of_week: form.days_of_week.includes(d)
        ? form.days_of_week.filter(x => x !== d)
        : [...form.days_of_week, d].sort(),
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Rule name"
        placeholder="e.g. Weekend rate, Diwali special"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">
          <span>Days of week (optional)</span>
          <InfoTooltip content="Leave blank to apply to any day of the week. Select specific days to restrict the rule (e.g. only Saturdays and Sundays)." />
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d, idx) => (
            <button
              type="button"
              key={d}
              onClick={() => toggleDay(idx)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                form.days_of_week.includes(idx)
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white dark:bg-ink-900 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-ink-800 hover:border-brand'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker info="Leave blank for a permanent year-round rule (e.g. all weekends). Select dates for a temporary seasonal rule (e.g. holidays)." label="Start date (optional)" value={form.start_date} onChange={val => setForm({ ...form, start_date: val })} />
        <DatePicker info="Leave blank for a permanent year-round rule." label="End date (optional)" value={form.end_date} onChange={val => setForm({ ...form, end_date: val })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TimeSelect info="Time-specific rules only apply to hourly 'Time slot' bookings. They will NOT apply to flat-rate 'Full day' bookings. Leave blank to apply to all booking types." label="Start time (optional)" name="start_time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
        <TimeSelect info="Time-specific rules only apply to hourly 'Time slot' bookings. They will NOT apply to flat-rate 'Full day' bookings. Leave blank to apply to all booking types." label="End time (optional)" name="end_time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Adjustment %"
          type="number"
          step="1"
          placeholder="e.g. 50 or -10"
          helperText="Positive to increase, negative to discount."
          info="The percentage you want to add or subtract from your base price. e.g. 50 adds 50% to your price. -20 subtracts 20%."
          value={form.adjustment_pct}
          onChange={e => setForm({ ...form, adjustment_pct: e.target.value })}
          required
        />
        <Input
          label="Priority"
          type="number"
          helperText="Higher priority wins when rules overlap."
          info="If two rules apply on the same day (e.g. a Weekend Rule and a Holiday Rule), the rule with the higher priority number will take effect."
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
        />
      </div>

      <div>
        <Select
          label="Applies to"
          value={form.applies_to}
          onChange={val => setForm({ ...form, applies_to: val as RuleFormState['applies_to'] })}
          options={[
            { value: 'both', label: 'Full day & time slots' },
            { value: 'full_day', label: 'Full day only' },
            { value: 'time_slot', label: 'Time slots only' }
          ]}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">
        <input
          type="checkbox"
          className="rounded text-brand focus:ring-brand"
          checked={form.is_active}
          onChange={e => setForm({ ...form, is_active: e.target.checked })}
        />
        Active
      </label>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

function ruleSummary(rule: PricingRule): string {
  const days = rule.days_of_week && rule.days_of_week.length
    ? rule.days_of_week.map(d => DAYS[d]).join(', ')
    : 'Any day'
  const pct = rule.multiplier != null ? Math.round((rule.multiplier - 1) * 100) : null
  const pctStr = pct != null ? `${pct >= 0 ? '+' : ''}${pct}%` : 'custom adjustment'
  const range = rule.start_date || rule.end_date
    ? ` · ${rule.start_date ?? '…'} to ${rule.end_date ?? '…'}`
    : ''
  const time = rule.start_time || rule.end_time
    ? ` · ${rule.start_time?.slice(0, 5) ?? '00:00'}-${rule.end_time?.slice(0, 5) ?? '24:00'}`
    : ''
  return `${days} · ${pctStr}${range}${time}`
}

export default function VenuePricingRules() {
  const { venueId } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [rules, setRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<RuleFormState>(emptyForm)
  const [creating, setCreating] = useState(false)

  const [editingRule, setEditingRule] = useState<PricingRule | null>(null)
  const [editForm, setEditForm] = useState<RuleFormState>(emptyForm)
  const [updating, setUpdating] = useState(false)

  const [minPct, setMinPct] = useState('50')
  const [maxPct, setMaxPct] = useState('200')
  const [savingBounds, setSavingBounds] = useState(false)

  const [previewDate, setPreviewDate] = useState('')
  const [previewBookingType, setPreviewBookingType] = useState<'full_day' | 'time_slot'>('full_day')
  const [previewStartTime, setPreviewStartTime] = useState('18:00')
  const [previewEndTime, setPreviewEndTime] = useState('22:00')
  const [preview, setPreview] = useState<PricingPreview | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!venueId) return
      setLoading(true)
      try {
        const client = createClient()
        const [venueData, rulesData] = await Promise.all([
          venueEndpoints(client).getMyVenue(venueId),
          venueEndpoints(client).getPricingRules(venueId),
        ])
        setVenue(venueData)
        setRules(rulesData)
        setMinPct(String(venueData.min_price_pct))
        setMaxPct(String(venueData.max_price_pct))
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing rules.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [venueId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venueId) return
    setCreating(true)
    setError(null)
    try {
      const client = createClient()
      const newRule = await venueEndpoints(client).createPricingRule(venueId, formToPayload(createForm))
      setRules(prev => [newRule, ...prev].sort((a, b) => b.priority - a.priority))
      setCreateForm(emptyForm)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create pricing rule.')
    } finally {
      setCreating(false)
    }
  }

  const openEdit = (rule: PricingRule) => {
    setEditingRule(rule)
    setEditForm(ruleToFormState(rule))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venueId || !editingRule) return
    setUpdating(true)
    setError(null)
    try {
      const client = createClient()
      const updated = await venueEndpoints(client).updatePricingRule(venueId, editingRule.id, formToPayload(editForm))
      setRules(prev => prev.map(r => (r.id === updated.id ? updated : r)).sort((a, b) => b.priority - a.priority))
      setEditingRule(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update pricing rule.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (!venueId || !(await confirmAction('Remove this pricing rule?'))) return
    setError(null)
    try {
      const client = createClient()
      await venueEndpoints(client).deletePricingRule(venueId, ruleId)
      setRules(prev => prev.filter(r => r.id !== ruleId))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove pricing rule.')
    }
  }

  const saveBounds = async () => {
    if (!venueId) return
    setSavingBounds(true)
    setError(null)
    try {
      const client = createClient()
      const updated = await venueEndpoints(client).updateVenue(venueId, {
        min_price_pct: Number(minPct),
        max_price_pct: Number(maxPct),
      })
      setVenue(updated)
      alert('Price bounds saved.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save bounds.')
    } finally {
      setSavingBounds(false)
    }
  }

  const runPreview = async () => {
    if (!venueId || !previewDate) return
    setPreviewing(true)
    setPreviewError(null)
    setPreview(null)
    try {
      const client = createClient()
      const starts_at = previewBookingType === 'full_day'
        ? `${previewDate}T00:00:00`
        : `${previewDate}T${previewStartTime.split(':').length === 2 ? previewStartTime + ':00' : previewStartTime}`
      const ends_at = previewBookingType === 'full_day'
        ? `${previewDate}T23:59:59`
        : `${previewDate}T${previewEndTime.split(':').length === 2 ? previewEndTime + ':00' : previewEndTime}`
      const result = await venueEndpoints(client).getOwnerPricingPreview(venueId, {
        starts_at, ends_at, booking_type: previewBookingType,
      })
      setPreview(result)
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : 'Failed to compute preview.')
    } finally {
      setPreviewing(false)
    }
  }

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('topbar-portal-target') : null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 space-y-6 pt-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-4 pt-6">
      {portalTarget && createPortal(
        <Link to={`/venues/${venueId}/overview`} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:text-zinc-100 transition-colors flex items-center gap-1.5 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-800 px-3 py-1.5 rounded-md shadow-sm hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Link>,
        portalTarget
      )}

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm mb-6">{error}</div>
      )}

      {/* Bounds panel */}
      <Card className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 border-b border-zinc-100 dark:border-ink-800 bg-zinc-50/50 rounded-t-xl gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand" />
              Price Bounds
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">No rule can ever push your price outside this range.</p>
          </div>
          <Button variant="secondary" onClick={saveBounds} disabled={savingBounds}>
            {savingBounds ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Bounds
          </Button>
        </div>
        <div className="p-6 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <Input info="The absolute lowest limit your price can ever reach. e.g. 50% means the final price will never drop below half your base price." label="Minimum %" type="number" value={minPct} onChange={e => setMinPct(e.target.value)} suffix="%" />
            <Input info="The absolute highest limit your price can ever reach. e.g. 200% means the final price will never exceed double your base price, even if a +150% rule is applied." label="Maximum %" type="number" value={maxPct} onChange={e => setMaxPct(e.target.value)} suffix="%" />
          </div>
          {venue && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 bg-zinc-50 dark:bg-ink-800 p-3 rounded-lg border border-zinc-200 dark:border-ink-800">
              Example: a ₹{((venue.starting_price_paise ?? venue.hourly_rate_paise ?? 0) / 100).toLocaleString('en-IN')} base price
              always stays between {minPct}% and {maxPct}% of that value.
            </p>
          )}
        </div>
      </Card>

      {/* Add rule */}
      <Card className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 border-b border-zinc-100 dark:border-ink-800 bg-zinc-50/50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand" />
              Add Pricing Rule
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Create a new dynamic pricing adjustment.</p>
          </div>
        </div>
        <div className="p-6 pt-5">
          <RuleForm form={createForm} setForm={setCreateForm} onSubmit={handleCreate} submitting={creating} submitLabel="Add rule" />
        </div>
      </Card>

      {/* Rules list */}
      <Card className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 border-b border-zinc-100 dark:border-ink-800 bg-zinc-50/50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <List className="w-5 h-5 text-brand" />
              Your Rules
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Manage your active pricing rules ({rules.length}).</p>
          </div>
        </div>
        <div className="p-6 pt-5">
          {rules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-ink-800 rounded-xl bg-zinc-50 dark:bg-ink-800">
              <Tag className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No pricing rules yet. Your base price applies to every booking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className={`group flex items-center justify-between p-4 bg-white dark:bg-ink-900 border rounded-xl shadow-sm transition-all ${rule.is_active ? 'border-zinc-200 dark:border-ink-800' : 'border-zinc-100 dark:border-ink-800 opacity-50'}`}>
                  <div>
                    <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                      {rule.name}
                      <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">priority {rule.priority}</span>
                      {rule.exceeds_bounds && (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">will be capped</span>
                      )}
                      {!rule.is_active && <span className="text-xs text-zinc-400 dark:text-zinc-500">(inactive)</span>}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-0.5">{ruleSummary(rule)}</div>
                  </div>
                  <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(rule)} className="p-2 text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 hover:text-brand rounded-md hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800" title="Edit rule">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(rule.id)} className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50" title="Delete rule">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Live preview */}
      <Card className="">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-zinc-100 dark:border-ink-800 bg-zinc-50/50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              Preview a price
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">See exactly how your rules apply to a specific date.</p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <DatePicker label="Date" value={previewDate} onChange={setPreviewDate} />
            <div>
              <Select
                label="Booking type"
                value={previewBookingType}
                onChange={val => setPreviewBookingType(val as 'full_day' | 'time_slot')}
                options={[
                  { value: 'full_day', label: 'Full day' },
                  { value: 'time_slot', label: 'Time slot' }
                ]}
              />
            </div>
            {previewBookingType === 'time_slot' && (
              <>
                <TimeSelect label="Start time" name="preview_start_time" value={previewStartTime} onChange={e => setPreviewStartTime(e.target.value)} />
                <TimeSelect label="End time" name="preview_end_time" value={previewEndTime} onChange={e => setPreviewEndTime(e.target.value)} />
              </>
            )}
            <Button variant="secondary" onClick={runPreview} disabled={previewing || !previewDate} className="h-10">
              {previewing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Preview
            </Button>
          </div>

          {previewError && <p className="text-sm text-red-600 mt-4 p-3 bg-red-50 rounded border border-red-200">{previewError}</p>}

          {preview && (
            <div className="mt-6 p-5 rounded-xl bg-zinc-50 dark:bg-ink-800 border border-zinc-200 dark:border-ink-800">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-ink-800 pb-3 mb-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 font-medium">Final Quote</span>
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{preview.display.quoted_price}</span>
              </div>
              {preview.clamped && (
                <p className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block mb-3">
                  ⚠️ A rule was capped by your price bounds for this quote.
                </p>
              )}
              {preview.breakdown.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Price Breakdown</p>
                  {preview.breakdown.map((b, i) => (
                    <div key={i} className="text-sm text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 flex justify-between bg-white dark:bg-ink-900 p-2 rounded border border-zinc-100 dark:border-ink-800 shadow-sm">
                      <span className="font-medium">
                        {b.period_date}{b.start_time ? ` ${b.start_time.slice(0, 5)}-${b.end_time?.slice(0, 5)}` : ''} 
                        <span className="text-zinc-400 dark:text-zinc-500 font-normal mx-2">—</span>
                        {b.applied_rule_name ?? 'Base price'}
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        ₹{(b.final_paise / 100).toLocaleString('en-IN')}{b.clamped ? <span className="text-amber-600 font-normal ml-1">(capped)</span> : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Modal open={!!editingRule} onClose={() => setEditingRule(null)} className="max-w-lg">
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Edit rule</h3>
          <RuleForm form={editForm} setForm={setEditForm} onSubmit={handleUpdate} submitting={updating} submitLabel="Save changes" />
        </div>
      </Modal>
    </div>
  )
}
