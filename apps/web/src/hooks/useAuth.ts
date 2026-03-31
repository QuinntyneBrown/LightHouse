"use client";

import { useState, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, _password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    // Mock login
    await new Promise((r) => setTimeout(r, 500));
    setState({
      user: { id: "1", email, name: email.split("@")[0] },
      token: "mock-token-123",
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const signup = useCallback(async (email: string, _password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 500));
    setState({
      user: { id: "1", email, name: email.split("@")[0] },
      token: "mock-token-123",
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return { ...state, login, signup, logout };
}
