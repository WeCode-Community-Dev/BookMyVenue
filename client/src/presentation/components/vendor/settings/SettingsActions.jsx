import React from "react";
import { Button } from "@/components/ui/button";

const SettingsActions = () => {
  return (
    <div className="flex justify-end gap-4">

      <Button variant="outline">
        Reset to Default
      </Button>

      <Button>
        Save Changes
      </Button>

    </div>
  );
};

export default SettingsActions;