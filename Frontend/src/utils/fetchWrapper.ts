import cookie from "cookie";

const API_URL = "http://localhost:4000";

interface FetchWrapperOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any;
}

const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = cookie.parse(document.cookie);
  return cookies.jwt || null;
};

const fetchWrapper = async (
  url: string,
  options: FetchWrapperOptions = {}
): Promise<any> => {
  const token = getTokenFromCookies();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }

  const fullUrl = `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default fetchWrapper;
