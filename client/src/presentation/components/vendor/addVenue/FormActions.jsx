import { Button } from "@/components/ui/button";

const FormActions = () => {
  return (
    <div className="flex justify-between mt-8">

      <Button
        variant="outline"
      >
        Back
      </Button>

      <div className="flex gap-3">

        <Button
          variant="secondary"
        >
          Save Draft
        </Button>

        <Button>
          Continue
        </Button>

      </div>

    </div>
  );
};

export default FormActions;