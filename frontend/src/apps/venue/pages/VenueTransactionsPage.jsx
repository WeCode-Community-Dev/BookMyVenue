import { useEffect, useMemo, useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  IndianRupee,
  XCircle,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { fetchOwnerTransactions, parsePaymentError } from "@/apis/payments"
import { fetchMyVenues } from "@/apis/venues"

const statusTabs = [
  { id: "all", label: "All" },
  { id: "success", label: "Successful" },
  { id: "order_created", label: "Pending" },
  { id: "failed", label: "Failed" },
]

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function formatDateTime(value) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function statusLabel(status) {
  const labels = {
    success: "Successful",
    order_created: "Pending",
    failed: "Failed",
    refund_pending: "Refund Pending",
    refunded: "Refunded",
  }
  return labels[status] || status
}

function statusClasses(status) {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    order_created: "bg-amber-100 text-amber-800 border-amber-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    refund_pending: "bg-orange-100 text-orange-700 border-orange-200",
    refunded: "bg-muted text-muted-foreground border-border",
  }
  return styles[status] || styles.refunded
}

function SummaryCard({ label, value, loading, icon: Icon, accent = "default" }) {
  const accentClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-muted" />
          ) : (
            <p className="mt-2 font-serif text-2xl font-semibold text-foreground">
              {value}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionCard({ transaction }) {
  const isIncoming = transaction.status === "success"
  const customerLabel =
    transaction.customerName ||
    transaction.customerEmail ||
    transaction.customerPhone ||
    "Customer"

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isIncoming
                ? "bg-emerald-100 text-emerald-700"
                : transaction.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {isIncoming ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {transaction.venueName}
            </h2>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {customerLabel}
              {transaction.eventDate && (
                <span> · Event {formatDate(transaction.eventDate)}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="font-serif text-xl font-semibold text-foreground">
            {formatCurrency(transaction.amount)}
          </p>
          <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClasses(transaction.status)}`}
          >
            {statusLabel(transaction.status)}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Transaction Date
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatDateTime(transaction.verifiedAt || transaction.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Payment ID
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-foreground">
            {transaction.razorpayPaymentId || transaction.razorpayOrderId || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Provider
          </p>
          <p className="mt-1 font-semibold capitalize text-foreground">
            {transaction.provider || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Booking
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {transaction.bookingId ? (
              <span className="capitalize">
                {transaction.bookingStatus || "linked"}
              </span>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

function filterTransactions(transactions, statusTab) {
  if (statusTab === "all") return transactions
  return transactions.filter((transaction) => transaction.status === statusTab)
}

export default function VenueTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [venueFilter, setVenueFilter] = useState("")

  useEffect(() => {
    let cancelled = false

    fetchMyVenues()
      .then((data) => {
        if (!cancelled) setVenues(data)
      })
      .catch(() => {
        // Venue filter is optional.
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadTransactions = async () => {
      setLoading(true)
      setError("")

      try {
        const params = venueFilter ? { venue: venueFilter } : {}
        const data = await fetchOwnerTransactions(params)
        if (!cancelled) {
          setTransactions(data.transactions)
          setSummary(data.summary)
        }
      } catch (err) {
        if (!cancelled) setError(parsePaymentError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTransactions()
    return () => {
      cancelled = true
    }
  }, [venueFilter])

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, activeTab),
    [transactions, activeTab],
  )

  const tabCounts = useMemo(
    () => ({
      all: transactions.length,
      success: transactions.filter((t) => t.status === "success").length,
      order_created: transactions.filter((t) => t.status === "order_created").length,
      failed: transactions.filter((t) => t.status === "failed").length,
    }),
    [transactions],
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track payments received across your venues.
          </p>
        </div>

        {venues.length > 1 && (
          <select
            value={venueFilter}
            onChange={(event) => setVenueFilter(event.target.value)}
            className="rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="">All venues</option>
            {venues.map((venue) => (
              <option key={venue.slug} value={venue.slug}>
                {venue.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Collected"
          value={formatCurrency(summary?.totalCollected ?? 0)}
          loading={loading}
          icon={IndianRupee}
          accent="success"
        />
        <SummaryCard
          label="This Month"
          value={formatCurrency(summary?.collectedThisMonth ?? 0)}
          loading={loading}
          icon={ArrowDownLeft}
          accent="default"
        />
        <SummaryCard
          label="Successful Payments"
          value={summary?.successfulCount ?? 0}
          loading={loading}
          icon={CheckCircle2}
          accent="success"
        />
        <SummaryCard
          label="Pending / Failed"
          value={`${summary?.pendingCount ?? 0} / ${summary?.failedCount ?? 0}`}
          loading={loading}
          icon={summary?.failedCount ? XCircle : Clock}
          accent={summary?.failedCount ? "danger" : "warning"}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            {summary?.transactionCount ?? 0} total transaction
            {(summary?.transactionCount ?? 0) === 1 ? "" : "s"}
            {(summary?.refundedTotal ?? 0) > 0 && (
              <span>
                {" "}
                · {formatCurrency(summary.refundedTotal)} refunded
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1 rounded-full border border-border bg-background p-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tabCounts[tab.id] > 0 && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({tabCounts[tab.id]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </div>
      )}

      {!loading && !error && visibleTransactions.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IndianRupee size={28} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No transactions found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {activeTab === "all"
              ? "Payments from customer bookings will appear here once checkout begins or completes."
              : `No ${statusTabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} transactions yet.`}
          </p>
        </div>
      )}

      {!loading && !error && visibleTransactions.length > 0 && (
        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
