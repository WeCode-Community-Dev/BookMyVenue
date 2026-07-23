export default function CancellationPolicy() {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
      <span className="text-green-600 text-xl">
        ✓
      </span>

      <div>
        <h3 className="font-semibold text-green-800">
          Free cancellation
        </h3>

        <p className="text-sm text-green-700 mt-1">
          Free cancellation up to 48 hours before the event.
        </p>
      </div>
    </div>
  );
}