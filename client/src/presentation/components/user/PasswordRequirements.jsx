import { CheckCircle, ShieldCheck } from "lucide-react";

const requirements = [
  "At least 8 characters",
  "One uppercase letter",
  "One lowercase letter",
  "One number",
  "One special character",
];

const PasswordRequirements = () => {
  return (
    <div className="space-y-6">

      <div className="bg-white border rounded-2xl p-6">

        <h3 className="font-bold text-lg">
          Password Requirements
        </h3>

        <p className="text-gray-500 text-sm mt-1 mb-5">
          Your password must contain:
        </p>

        <div className="space-y-4">
          {requirements.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <CheckCircle
                className="text-green-500"
                size={18}
              />

              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex gap-4">

          <ShieldCheck
            className="text-blue-600"
            size={32}
          />

          <div>
            <h4 className="font-semibold">
              Keep Your Account Safe
            </h4>

            <p className="text-gray-600 text-sm mt-2">
              Choose a strong password that you don't use on
              other websites.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PasswordRequirements;