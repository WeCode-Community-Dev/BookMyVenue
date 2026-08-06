// App-wide toast. `type` selects the color: "error" → red, "info" → green.
const TYPE_STYLES = {
   error: { container: "bg-red-500", close: "hover:text-red-200" },
   info: { container: "bg-green-500", close: "hover:text-green-200" },
};

export function Toast({ message, type = "error", onClose }) {
   const styles = TYPE_STYLES[type] ?? TYPE_STYLES.error; // defaults is error
   return (
      <div className={`fixed top-5 right-5 z-9999 flex items-center gap-3 ${styles.container} text-white px-5 py-3 rounded-lg shadow-lg`}>
         <span>{message}</span>
         <button onClick={onClose} className={`text-white font-bold ${styles.close}`}>✕</button>
      </div>
   );
}
