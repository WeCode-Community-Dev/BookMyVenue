import { SignUp } from "@clerk/nextjs";

export default function OwnerSignUpPage() {
    const appearance = {
        variables: {
            colorPrimary: "#7B1F2E",
            colorBackground: "#FAFAF9",
            colorInputBackground: "#EDE9FE",
            colorText: "#1F2937",
            colorTextSecondary: "#6B7280",
            colorDanger: "#d4183d",
            borderRadius: "0.625rem",
            fontFamily: "var(--font-geist-sans), sans-serif",
        },
        elements: {
            card: "shadow-2xl border border-[rgba(109,40,217,0.15)]",
            socialButtonsBlockButton: "border border-[rgba(109,40,217,0.15)] hover:bg-[#EDE9FE]",
            formFieldInput: "border border-[rgba(109,40,217,0.15)]",
            footerActionLink: "text-[#7B1F2E] hover:opacity-80",
            identityPreviewEditButton: "text-[#7B1F2E]",
        },
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/30 py-16 px-4">
            <SignUp
                appearance={appearance}
                unsafeMetadata={{ role: "OWNER" }}
            />
        </div>
    );
}
