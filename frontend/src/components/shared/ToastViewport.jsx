import { useCallback, useEffect, useState } from "react";
import { toastBus } from "../../utils/toastBus";
import { Toast } from "./Toast";

// Mount once near the app root. Subscribes to the toast bus and renders the
// active toast. Components and plain modules fire toasts via showError /
// showInfo from utils/toastBus — this only owns the on-screen state and
// auto-dismiss.
export function ToastViewport() {
   const [toast, setToast] = useState(null);

   const showToast = useCallback((message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 5000);
   }, []);

   useEffect(() => {
      toastBus.subscribe(showToast);
      return () => toastBus.unsubscribe(showToast);
   }, [showToast]);

   if (!toast) return null;

   return (
      <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
   );
}