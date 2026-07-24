const PasswordStrength = ({ password }) => {
    if (!password) return null;
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
  
    const passed = Object.values(checks).filter(Boolean).length;
  
    let strength;
    let color;
  
    if (passed <= 2) {
      strength = "Weak";
      color = "bg-red-500";
    } else if (passed <= 4) {
      strength = "Medium";
      color = "bg-yellow-500";
    } else {
      strength = "Strong";
      color = "bg-green-500";
    }
  
    return (
      <div className="mt-3">
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`${color} h-full transition-all duration-300`}
            style={{ width: `${(passed / 5) * 100}%` }}
          />
        </div>
  
        <p className="mt-2 text-sm font-medium">
          Password Strength:{" "}
          <span
            className={
              passed <= 2
                ? "text-red-500"
                : passed <= 4
                ? "text-yellow-600"
                : "text-green-600"
            }
          >
            {strength}
          </span>
        </p>
      </div>
    );
  };
  
  export default PasswordStrength;