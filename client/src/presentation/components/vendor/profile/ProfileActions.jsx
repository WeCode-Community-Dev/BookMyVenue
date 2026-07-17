import React from "react";
import { Button } from "@/components/ui/button";

const ProfileActions = ({
  onSave,
  onCancel,
  updating,
}) => {
  return (
    <div className="flex justify-end gap-4">

      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>

      <Button
        onClick={onSave}
        disabled={updating}
      >
        {updating ? "Saving..." : "Save Changes"}
      </Button>

    </div>
  );
};

export default ProfileActions;