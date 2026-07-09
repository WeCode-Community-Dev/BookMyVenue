import type {
  AuthProvider,
  AuthSession,
  AuthClaims,
  OAuthProviderId,
  OAuthSignInOptions,
  OAuthSignInResult,
  Unsubscribe,
  StorageProvider,
  SignedUrl,
  UploadResult,
  VenuesRepo,
  VenueListItem,
  VenueWriteInput,
  BookingsRepo,
  BookingWithVenue,
} from "@repo/contracts";
import type { Venue, VenueListFilter } from "@repo/domain/venues";
import type { Booking, BookingStatus } from "@repo/domain/bookings";

// ==========================================
// 1. HTTP Auth Provider
// ==========================================

export interface HttpAuthConfig {
  apiUrl: string;
  storage: {
    getItem(key: string): Promise<string | null> | string | null;
    setItem(key: string, value: string): Promise<void> | void;
    removeItem(key: string): Promise<void> | void;
  };
}

export function makeHttpAuthProvider(config: HttpAuthConfig): AuthProvider {
  const listeners = new Set<(session: AuthSession | null) => void>();
  let currentSession: AuthSession | null = null;
  const tokenKey = "better-auth.session_token";

  function notify(session: AuthSession | null) {
    currentSession = session;
    for (const listener of listeners) {
      try {
        listener(session);
      } catch (e) {
        console.error(e);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mapToSession(data: any): AuthSession | null {
    if (!data?.session || !data?.user) return null;
    return {
      accessToken: data.session.token ?? "",
      refreshToken: null,
      expiresAt: data.session.expiresAt ? new Date(data.session.expiresAt).getTime() / 1000 : null,
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
        metadata: {
          first_name: data.user.firstName ?? data.user.name?.split(" ")[0] ?? null,
          last_name: data.user.lastName ?? data.user.name?.split(" ").slice(1).join(" ") ?? null,
          role: data.user.role ?? null,
        },
      },
    };
  }

  return {
    async signInWithPassword({ email, password }) {
      const res = await fetch(`${config.apiUrl}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Sign in failed with status ${res.status}`);
      }
      const data = await res.json();
      const session = mapToSession(data);
      if (!session) throw new Error("Invalid session data returned");
      await config.storage.setItem(tokenKey, session.accessToken);
      notify(session);
      return session;
    },

    async signUp({ email, password, metadata }) {
      const name = [metadata?.first_name, metadata?.last_name].filter(Boolean).join(" ");
      const res = await fetch(`${config.apiUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
          firstName: metadata?.first_name,
          lastName: metadata?.last_name,
          role: metadata?.role || "customer",
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Sign up failed with status ${res.status}`);
      }
      const data = await res.json();
      const session = mapToSession(data);
      if (session) {
        await config.storage.setItem(tokenKey, session.accessToken);
        notify(session);
      }
      return { session };
    },

    async signInWithOAuth(
      _provider: OAuthProviderId,
      _opts?: OAuthSignInOptions,
    ): Promise<OAuthSignInResult> {
      return {
        redirected: false,
        error: new Error("OAuth sign-in is not implemented on mobile HTTP client yet."),
      };
    },

    async signOut() {
      const token = await config.storage.getItem(tokenKey);
      if (token) {
        await fetch(`${config.apiUrl}/api/auth/sign-out`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
      await config.storage.removeItem(tokenKey);
      notify(null);
    },

    async getSession() {
      const token = await config.storage.getItem(tokenKey);
      if (!token) return null;
      try {
        const res = await fetch(`${config.apiUrl}/api/auth/get-session`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          await config.storage.removeItem(tokenKey);
          notify(null);
          return null;
        }
        const data = await res.json();
        const session = mapToSession(data);
        if (!session) {
          await config.storage.removeItem(tokenKey);
          notify(null);
          return null;
        }
        currentSession = session;
        return session;
      } catch (err) {
        return null;
      }
    },

    onAuthStateChange(cb): Unsubscribe {
      listeners.add(cb);
      if (currentSession !== null) {
        cb(currentSession);
      } else {
        this.getSession().then((session) => {
          if (session) cb(session);
        });
      }
      return () => {
        listeners.delete(cb);
      };
    },

    async resetPasswordForEmail(email, opts) {
      const res = await fetch(`${config.apiUrl}/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: opts?.redirectUri }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to request password reset");
      }
    },

    async updatePassword(newPassword) {
      const token = await config.storage.getItem(tokenKey);
      if (!token) throw new Error("No active session");
      const res = await fetch(`${config.apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update password");
      }
    },

    async verifyAccessToken(_token: string): Promise<AuthClaims> {
      throw new Error("verifyAccessToken is not supported on client HTTP Auth Provider");
    },
  };
}

// ==========================================
// 2. HTTP Storage Provider
// ==========================================

export interface HttpStorageConfig {
  apiUrl: string;
  getToken?: () => Promise<string | null> | string | null;
}

export function makeHttpStorageProvider(config: HttpStorageConfig): StorageProvider {
  return {
    getPublicUrl(_bucket: string, path: string): string {
      return `${config.apiUrl}/api/storage/public/${path}`;
    },

    async createSignedUploadUrl(_bucket: string, _path: string): Promise<SignedUrl> {
      return {
        url: `${config.apiUrl}/api/storage/upload`,
        method: "POST",
        expiresIn: 3600,
      };
    },

    async createSignedDownloadUrl(_bucket: string, path: string): Promise<SignedUrl> {
      return {
        url: `${config.apiUrl}/api/storage/private/${path}`,
        method: "GET",
        expiresIn: 3600,
      };
    },

    async upload(
      bucket: string,
      path: string,
      file: Blob | ArrayBuffer | Uint8Array,
    ): Promise<UploadResult> {
      const token = config.getToken ? await config.getToken() : null;
      const formData = new FormData();
      formData.append("bucket", bucket);
      formData.append("path", path);
      formData.append("file", file as any);

      const res = await fetch(`${config.apiUrl}/api/storage/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
      return res.json();
    },

    async delete(bucket: string, paths: string[]): Promise<void> {
      const token = config.getToken ? await config.getToken() : null;
      const res = await fetch(`${config.apiUrl}/api/storage/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bucket, paths }),
      });
      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}`);
      }
    },

    async getObject() {
      throw new Error("getObject is a server-side operation and not available on HTTP clients.");
    },
  };
}

// ==========================================
// 3. HTTP Venues Repository
// ==========================================

export function makeHttpVenuesRepo(config: { apiUrl: string }): VenuesRepo {
  return {
    async listActive(filter: VenueListFilter): Promise<VenueListItem[]> {
      const q = new URLSearchParams();
      if (filter.search) q.set("search", filter.search);
      if (filter.venue_type) q.set("venue_type", filter.venue_type);
      if (filter.min_capacity !== undefined) q.set("min_capacity", filter.min_capacity.toString());

      const res = await fetch(`${config.apiUrl}/api/public/venues?${q.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to list venues: ${res.statusText}`);
      }
      const data = await res.json();
      return data.venues || [];
    },

    async findById(id: string): Promise<Venue | null> {
      const res = await fetch(`${config.apiUrl}/api/public/venues?id=${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to find venue: ${res.statusText}`);
      }
      const data = await res.json();
      return data.venue || null;
    },

    async listByHost(_hostId: string): Promise<Venue[]> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async create(_input: VenueWriteInput & { host_id: string }): Promise<Venue> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async update(_id: string, _patch: Partial<VenueWriteInput>): Promise<Venue> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async delete(_id: string): Promise<void> {
      throw new Error("Method not implemented on mobile HTTP client");
    },
  };
}

// ==========================================
// 4. HTTP Bookings Repository
// ==========================================

export function makeHttpBookingsRepo(config: {
  apiUrl: string;
  getToken: () => Promise<string | null> | string | null;
}): BookingsRepo {
  return {
    async listForCustomer(_customerId: string): Promise<BookingWithVenue[]> {
      const token = await config.getToken();
      const res = await fetch(`${config.apiUrl}/api/bookings`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to list bookings: ${res.statusText}`);
      }
      return res.json();
    },

    async findVenuePricing(
      _id: string,
    ): Promise<Pick<Venue, "id" | "base_price_cents" | "currency" | "pricing_mode"> | null> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async findConflicts(_args: {
      venue_id: string;
      start_time: string;
      end_time: string;
    }): Promise<Array<Pick<Booking, "id" | "status" | "expires_at" | "start_time" | "end_time">>> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async create(_input: Omit<Booking, "id" | "version">): Promise<Booking> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async findById(_id: string): Promise<Booking | null> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async updateStatus(_args: {
      id: string;
      version: number;
      status: BookingStatus;
      expires_at: string | null;
    }): Promise<Booking> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async setStatus(_id: string, _status: BookingStatus): Promise<void> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async listForHost(_hostId: string): Promise<BookingWithVenue[]> {
      throw new Error("Method not implemented on mobile HTTP client");
    },

    async findWithVenue(_id: string): Promise<BookingWithVenue | null> {
      throw new Error("Method not implemented on mobile HTTP client");
    },
  };
}
