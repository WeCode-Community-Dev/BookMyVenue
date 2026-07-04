import React from "react";
import { Button } from "@/components/ui/button";

const SettingsActions = ({ onReset, onSave }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onReset}>
        Reset to Default
      </Button>

      <Button onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsActions;