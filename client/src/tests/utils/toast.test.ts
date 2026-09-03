import { describe, it, expect, vi } from 'vitest';

const mockSuccess = vi.fn();
const mockError = vi.fn();
const mockToast = vi.fn();

vi.mock('react-hot-toast', () => ({
  default: Object.assign(mockToast, { success: mockSuccess, error: mockError }),
}));

describe('toast utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showSuccess', () => {
    it('should call toast.success with message and options', async () => {
      const { showSuccess } = await import('../../utils/toast');
      showSuccess('Operation successful');
      expect(mockSuccess).toHaveBeenCalledWith(
        'Operation successful',
        expect.objectContaining({ duration: 3000 })
      );
    });
  });

  describe('showError', () => {
    it('should call toast.error with message and options', async () => {
      const { showError } = await import('../../utils/toast');
      showError('Something went wrong');
      expect(mockError).toHaveBeenCalledWith(
        'Something went wrong',
        expect.objectContaining({ duration: 4000 })
      );
    });
  });

  describe('showInfo', () => {
    it('should call toast with message and options', async () => {
      const { showInfo } = await import('../../utils/toast');
      showInfo('Information');
      expect(mockToast).toHaveBeenCalledWith(
        'Information',
        expect.objectContaining({ duration: 3000 })
      );
    });
  });

  describe('extractErrorMessage', () => {
    it('should extract message from Axios-like error response data', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      const error = { response: { data: { message: 'Email already exists' } } };
      expect(extractErrorMessage(error)).toBe('Email already exists');
    });

    it('should extract error field from response data', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      const error = { response: { data: { error: 'Unauthorized' } } };
      expect(extractErrorMessage(error)).toBe('Unauthorized');
    });

    it('should fall back to error.message', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      const error = new Error('Network Error');
      expect(extractErrorMessage(error)).toBe('Network Error');
    });

    it('should use fallback when no message is available', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      expect(extractErrorMessage({}, 'Default fallback')).toBe('Default fallback');
    });

    it('should use default fallback when none provided', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      expect(extractErrorMessage(null)).toBe('An unexpected error occurred');
    });

    it('should handle non-object errors', async () => {
      const { extractErrorMessage } = await import('../../utils/toast');
      expect(extractErrorMessage('string error')).toBe('An unexpected error occurred');
    });
  });
});
