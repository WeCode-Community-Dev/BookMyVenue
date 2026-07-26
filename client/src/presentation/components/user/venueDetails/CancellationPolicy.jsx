export default function CancellationPolicy() {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
      <span className="text-green-600 text-xl">
        ✓
      </span>

      <div>
        <h3 className="font-semibold text-green-800">
          Flexible cancellation policy
        </h3>

        <p className="text-sm text-green-700 mt-1">
          Cancel up to 72 hours before the event and receive a full refund of your 20% advance payment.
        </p>

        <p className="text-sm text-green-700 mt-2">
          An advance payment of 20% of the total booking amount is required.
        </p>
      </div>
    </div>
  );
}