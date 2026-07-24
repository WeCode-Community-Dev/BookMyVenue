import { useRef, useEffect } from "react";

const OTP_LENGTH = 6;

const OtpInput = ({ value, onChange, disabled = false, error }) => {
  const inputsRef = useRef([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");
  const errorId = error ? "otp-error" : undefined;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const updateValue = (nextDigits) => {
    onChange(nextDigits.join("").replace(/\s/g, ""));
  };

  const handleChange = (index, char) => {
    const sanitized = char.replace(/\D/g, "");
    const next = [...digits];

    if (!sanitized) {
      next[index] = " ";
      updateValue(next);
      return;
    }

    next[index] = sanitized.slice(-1);
    updateValue(next);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];

      if (digits[index] && digits[index] !== " ") {
        next[index] = " ";
        updateValue(next);
        return;
      }

      if (index > 0) {
        next[index - 1] = " ";
        updateValue(next);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    updateValue(pasted.padEnd(OTP_LENGTH, " ").split(""));
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div>
      <div
        className="flex gap-2"
        role="group"
        aria-label="Verification code"
        aria-describedby={errorId}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit.trim()}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            className={`h-12 w-full min-w-0 flex-1 rounded-lg border bg-white text-center text-lg font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-2 disabled:opacity-70 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-red-500 focus:ring-red-100"
            }`}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;
