import { useModalStore, type ActiveModal } from "@/store/useModalStore";

export function useModal() {
  const open = useModalStore((s) => s.open);
  const close = useModalStore((s) => s.close);

  const openModal = (config: Omit<ActiveModal, "id">) => open(config);
  return { openModal, closeModal: close };
}
