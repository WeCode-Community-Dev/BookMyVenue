import Modal from "../../components/common/Modal";
import LoginForm from "../../components/auth/LoginForm";

function LoginBookingModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In"
    >
      <LoginForm
        isModal
        onSuccess={onSuccess}
        onSwitchToRegister={onSwitchToRegister}
      />
    </Modal>
  );
}

export default LoginBookingModal;