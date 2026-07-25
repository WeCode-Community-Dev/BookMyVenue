import { Button } from "@/components/ui/button"
import Modal from "./Modal";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="max-w-md"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;