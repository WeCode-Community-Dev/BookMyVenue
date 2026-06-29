import React from "react";
import { Button } from "@/components/ui/button";

const ProfileActions = () => {
  return (
    <div className="flex justify-end gap-4">

      <Button variant="outline">
        Cancel
      </Button>

      <Button>
        Save Changes
      </Button>

    </div>
  );
};

export default ProfileActions;