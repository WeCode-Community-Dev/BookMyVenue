import { showSuccess, showError, showInfo } from '@/utils/toast';

export function useToast() {
  return { success: showSuccess, error: showError, info: showInfo };
}
