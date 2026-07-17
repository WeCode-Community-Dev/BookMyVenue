import { useState, useEffect } from "react";
import { rejectReasonSchema } from "@/lib/validation/adminVendorValidation";

const RejectReasonModal = ({
    isOpen,
    onClose,
    onSubmit,
    title = "Reject",
}) => {

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* const handleReject = () => {
 
         if (!reason.trim()) {
             alert("Please enter rejection reason.");
             return;
         }
 
         onSubmit(reason);
     };*/
    const handleReject = () => {

        const result = rejectReasonSchema.safeParse({
            reason,
        });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError("");
        onSubmit(reason);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-[450px] p-6">

                <h2 className="text-xl font-semibold mb-4">
                    {title}
                </h2>

                <textarea
                    rows={5}
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Enter rejection reason..."
                    className={`w-full rounded-lg p-3 resize-none focus:outline-none border ${error ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {error && (
                    <p className="text-sm text-red-500 mt-2">
                        {error}
                    </p>
                )}


                <div className="flex justify-end gap-3 mt-5">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleReject}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white"
                    >
                        Reject
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RejectReasonModal;