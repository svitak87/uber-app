const API_BASE_URL = import.meta.env.VITE_API_URL;

let refreshPromise = null;

const refreshTokens = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  let response = await fetch(url, config);

  if (response.status === 401 && path !== "/auth/refresh") {
    const refreshed = await refreshTokens();

    if (refreshed) {
      response = await fetch(url, config);
    }
  }

  return response;
};

export const apiErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    if (data && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // Ignore unparseable response bodies.
  }

  return fallback;
};