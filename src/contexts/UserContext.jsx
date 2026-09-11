/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_REDIRECT_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY, authService } from "@/services";

const UserContext = createContext(null);

function readStoredToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function normalizeUser(response) {
  return response?.data ?? response?.user ?? null;
}

export function UserProvider({ children }) {
  const [token, setTokenState] = useState(() => readStoredToken());
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(token));
  const [authError, setAuthError] = useState("");

  const setToken = useCallback((nextToken) => {
    setTokenState(nextToken);
    if (nextToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
      return;
    }

    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!readStoredToken()) {
      setUser(null);
      setIsLoadingUser(false);
      return null;
    }

    setIsLoadingUser(true);
    setAuthError("");

    try {
      const response = await authService.getProfile();
      const nextUser = normalizeUser(response);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      setUser(null);
      setToken(null);
      setAuthError(error.message || "Unable to load your profile.");
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [setToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchCurrentUser();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchCurrentUser, token]);

  const startGoogleAuth = useCallback((redirectTo) => {
    if (redirectTo) {
      localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirectTo);
    }
    window.location.assign(authService.googleAuthUrl());
  }, []);

  const completeGoogleAuth = useCallback(
    async (nextToken) => {
      setToken(nextToken);
      return fetchCurrentUser();
    },
    [fetchCurrentUser, setToken],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthError("");
  }, [setToken]);

  const updateProfile = useCallback(
    async (profile) => {
      const response = await authService.updateProfile(profile);
      const nextUser = normalizeUser(response);
      setUser(nextUser);
      return nextUser;
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoadingUser,
      authError,
      startGoogleAuth,
      completeGoogleAuth,
      fetchCurrentUser,
      updateProfile,
      logout,
    }),
    [
      user,
      token,
      isLoadingUser,
      authError,
      startGoogleAuth,
      completeGoogleAuth,
      fetchCurrentUser,
      updateProfile,
      logout,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
