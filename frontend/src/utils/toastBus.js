const listeners = [];

// Lightweight app-wide toasts. Call showError / showInfo from anywhere
// (React components or plain modules like the API client) — no need to pass a
// type string at the call site. "error" renders red, "info" renders green.
function emit(message, type) {
   listeners.forEach(fn => fn(message, type));
}

export const toastBus = {
   subscribe: (fn) => listeners.push(fn),
   unsubscribe: (fn) => listeners.splice(listeners.indexOf(fn), 1),
};

export function showError(message) {
   emit(message, "error");
}

export function showInfo(message) {
   emit(message, "info");
}
