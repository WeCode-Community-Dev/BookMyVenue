import axios from "axios";
import api from "./axios";

jest.mock("axios", () => {
  const requestUse = jest.fn();
  const responseUse = jest.fn();
  const instance = jest.fn();
  instance.interceptors = {
    request: { use: requestUse },
    response: { use: responseUse },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => instance),
      post: jest.fn(),
      requestUse,
      responseUse,
      instance,
    },
  };
});

const requestHandler = axios.requestUse.mock.calls[0][0];
const responseErrorHandler = axios.responseUse.mock.calls[0][1];

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test("does not attach a stored token to public API requests", () => {
  localStorage.setItem("accessToken", "expired-token");
  const config = { headers: {} };

  expect(requestHandler(config)).toBe(config);
  expect(config.headers.Authorization).toBeUndefined();
});

test("attaches a stored token to protected API requests", () => {
  localStorage.setItem("accessToken", "current-token");
  const config = { headers: {}, requiresAuth: true };

  requestHandler(config);

  expect(config.headers.Authorization).toBe("Bearer current-token");
});

test("refreshes an expired token and retries a protected request", async () => {
  localStorage.setItem("refreshToken", "current-refresh-token");
  axios.post.mockResolvedValue({ data: { access: "new-access-token" } });
  api.mockResolvedValue({ data: [] });
  const originalRequest = {
    headers: {},
    requiresAuth: true,
    url: "/favorites/",
  };

  await responseErrorHandler({
    config: originalRequest,
    response: { status: 401 },
  });

  expect(localStorage.getItem("accessToken")).toBe("new-access-token");
  expect(originalRequest.headers.Authorization).toBe("Bearer new-access-token");
  expect(api).toHaveBeenCalledWith(originalRequest);
});
