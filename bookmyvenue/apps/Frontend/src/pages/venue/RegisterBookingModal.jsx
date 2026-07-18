import Modal from "../../components/common/Modal";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterBookingModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
    >
      <RegisterForm
        isModal
        onSuccess={onSuccess}
        onSwitchToLogin={onSwitchToLogin}
      />
    </Modal>
  );
}

export default RegisterBookingModal;