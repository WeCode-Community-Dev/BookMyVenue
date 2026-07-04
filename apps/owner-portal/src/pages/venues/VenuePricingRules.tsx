import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, SectionHeader, Button, Input, Skeleton, Modal } from '@venue404/ui'
import { Loader2, Save, Trash2, Pencil, ArrowLeft, Tag, Sparkles } from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { Venue, PricingRule, PricingPreview } from '@venue404/api-client'

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
    start_time: form.start_time ? `${form.start_time}:00` : null,
    end_time: form.end_time ? `${form.end_time}:00` : null,
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
        <label className="block text-sm font-medium text-zinc-700 mb-1">Days of week (leave blank for any day)</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d, idx) => (
            <button
              type="button"
              key={d}
              onClick={() => toggleDay(idx)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                form.days_of_week.includes(idx)
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-brand'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Start date (optional)" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
        <Input label="End date (optional)" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Start time (optional)" type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
        <Input label="End time (optional)" type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Adjustment %"
          type="number"
          step="1"
          placeholder="e.g. 50 or -10"
          helperText="Positive to increase, negative to discount."
          value={form.adjustment_pct}
          onChange={e => setForm({ ...form, adjustment_pct: e.target.value })}
          required
        />
        <Input
          label="Priority"
          type="number"
          helperText="Higher priority wins when rules overlap."
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Applies to</label>
        <select
          className="w-full px-3 py-2 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand/20 text-sm"
          value={form.applies_to}
          onChange={e => setForm({ ...form, applies_to: e.target.value as RuleFormState['applies_to'] })}
        >
          <option value="both">Full day & time slots</option>
          <option value="full_day">Full day only</option>
          <option value="time_slot">Time slots only</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
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
    if (!venueId || !window.confirm('Remove this pricing rule?')) return
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
        : `${previewDate}T${previewStartTime}:00`
      const ends_at = previewBookingType === 'full_day'
        ? `${previewDate}T23:59:59`
        : `${previewDate}T${previewEndTime}:00`
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

  if (loading) {
    return (
      <div className="space-y-6 pb-12 max-w-5xl mx-auto pt-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <Link to={`/venues/${venueId}/overview`} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Overview
      </Link>

      <SectionHeader
        title="Dynamic Pricing"
        description="Set percentage rules for weekends, peak hours, and special dates. The highest-priority matching rule wins — no stacking."
      />

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Bounds panel */}
      <Card className="p-6">
        <h4 className="font-medium text-zinc-900 mb-1">Price bounds</h4>
        <p className="text-sm text-zinc-500 mb-4">No rule can ever push your price outside this range, as a % of your base price.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input label="Minimum %" type="number" value={minPct} onChange={e => setMinPct(e.target.value)} suffix="%" />
          <Input label="Maximum %" type="number" value={maxPct} onChange={e => setMaxPct(e.target.value)} suffix="%" />
          <Button variant="secondary" onClick={saveBounds} disabled={savingBounds}>
            {savingBounds ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save bounds
          </Button>
        </div>
        {venue && (
          <p className="text-xs text-zinc-400 mt-3">
            Example: a ₹{((venue.starting_price_paise ?? venue.hourly_rate_paise ?? 0) / 100).toLocaleString('en-IN')} base price
            always stays between {minPct}% and {maxPct}% of that value.
          </p>
        )}
      </Card>

      {/* Add rule */}
      <Card className="p-6">
        <h4 className="font-medium text-zinc-900 mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Add pricing rule
        </h4>
        <RuleForm form={createForm} setForm={setCreateForm} onSubmit={handleCreate} submitting={creating} submitLabel="Add rule" />
      </Card>

      {/* Rules list */}
      <div>
        <h4 className="font-medium text-zinc-900 mb-4">Your pricing rules ({rules.length})</h4>
        {rules.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 bg-zinc-50 rounded-lg border border-zinc-200">
            <Tag className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
            <p>No pricing rules yet. Your base price applies to every booking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className={`group flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-all ${rule.is_active ? 'border-zinc-200' : 'border-zinc-100 opacity-50'}`}>
                <div>
                  <div className="flex items-center gap-2 font-medium text-zinc-900">
                    {rule.name}
                    <span className="text-xs font-normal text-zinc-400">priority {rule.priority}</span>
                    {rule.exceeds_bounds && (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">will be capped</span>
                    )}
                    {!rule.is_active && <span className="text-xs text-zinc-400">(inactive)</span>}
                  </div>
                  <div className="text-sm text-zinc-500 mt-0.5">{ruleSummary(rule)}</div>
                </div>
                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(rule)} className="p-2 text-zinc-500 hover:text-brand rounded-md hover:bg-zinc-50" title="Edit rule">
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

      {/* Live preview */}
      <Card className="p-6">
        <h4 className="font-medium text-zinc-900 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Preview a price
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <Input label="Date" type="date" value={previewDate} onChange={e => setPreviewDate(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Booking type</label>
            <select
              className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm"
              value={previewBookingType}
              onChange={e => setPreviewBookingType(e.target.value as 'full_day' | 'time_slot')}
            >
              <option value="full_day">Full day</option>
              <option value="time_slot">Time slot</option>
            </select>
          </div>
          {previewBookingType === 'time_slot' && (
            <>
              <Input label="Start time" type="time" value={previewStartTime} onChange={e => setPreviewStartTime(e.target.value)} />
              <Input label="End time" type="time" value={previewEndTime} onChange={e => setPreviewEndTime(e.target.value)} />
            </>
          )}
          <Button variant="secondary" onClick={runPreview} disabled={previewing || !previewDate}>
            {previewing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Preview
          </Button>
        </div>

        {previewError && <p className="text-sm text-red-600 mt-3">{previewError}</p>}

        {preview && (
          <div className="mt-4 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Final price</span>
              <span className="text-lg font-semibold text-zinc-900">{preview.display.quoted_price}</span>
            </div>
            {preview.clamped && (
              <p className="text-xs text-amber-700 mt-1">A rule was capped by your price bounds for this quote.</p>
            )}
            {preview.breakdown.length > 0 && (
              <div className="mt-3 space-y-1">
                {preview.breakdown.map((b, i) => (
                  <div key={i} className="text-xs text-zinc-500 flex justify-between">
                    <span>
                      {b.period_date}{b.start_time ? ` ${b.start_time.slice(0, 5)}-${b.end_time?.slice(0, 5)}` : ''} — {b.applied_rule_name ?? 'base price'}
                    </span>
                    <span>₹{(b.final_paise / 100).toLocaleString('en-IN')}{b.clamped ? ' (capped)' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal open={!!editingRule} onClose={() => setEditingRule(null)} className="max-w-lg">
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <h3 className="text-lg font-medium text-zinc-900 mb-4">Edit rule</h3>
          <RuleForm form={editForm} setForm={setEditForm} onSubmit={handleUpdate} submitting={updating} submitLabel="Save changes" />
        </div>
      </Modal>
    </div>
  )
}
