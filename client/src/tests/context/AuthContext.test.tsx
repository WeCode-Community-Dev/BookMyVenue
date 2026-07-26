import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockClear = vi.fn();

vi.mock('@/config/axios', () => ({
  axiosInstance: {
    get: mockGet,
    post: mockPost,
  },
}));

vi.mock('@/config/queryClient', () => ({
  queryClient: {
    clear: mockClear,
  },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}));

vi.mock('@/utils/venueDraft', () => ({
  clearDraft: vi.fn(),
  clearDraftSession: vi.fn(),
}));

vi.mock('@/utils/profileGreeting', () => ({
  resetProfileGreeting: vi.fn(),
}));

vi.mock('@/constants', () => ({
  STORAGE_KEYS: {
    SESSION_TOKEN: 'x-session-token',
    IS_LOGGED_IN: 'isLoggedIn',
    USER_ID: 'user_id',
    USER_NAME: 'user_name',
    USER_ROLE: 'user_role',
  },
  API_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/user/profile',
  },
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render children', async () => {
    const { AuthProvider } = await import('../../context/AuthContext');
    render(
      <AuthProvider>
        <div>child content</div>
      </AuthProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('should call verifySession on mount when logged in', async () => {
    localStorage.setItem('isLoggedIn', 'true');
    mockGet.mockResolvedValue({
      data: { data: { _id: 'user-1', username: 'john', email: 'john@test.com' } },
    });

    const { AuthProvider } = await import('../../context/AuthContext');
    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/user/profile');
    });
  });

  it('should not call verifySession on mount when not logged in', async () => {
    const { AuthProvider } = await import('../../context/AuthContext');
    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  it('should clear auth data on auth:logout event', async () => {
    const { AuthProvider } = await import('../../context/AuthContext');
    render(
      <AuthProvider>
        <div>child</div>
      </AuthProvider>
    );

    act(() => {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    });

    await waitFor(() => {
      expect(mockClear).toHaveBeenCalled();
    });
  });
});
