import { Button } from "@/components/ui/button";

const FormActions = ({ onPublish }) => {
  return (
    <div className="flex justify-end mt-8">
      <Button onClick={onPublish} className="bg-blue-600 text-white">
        Publish Venue
      </Button>
    </div>
  );
};

export default FormActions;
