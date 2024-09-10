import { defineStore } from "pinia";
import { fetchData } from '~/services/api';

// Define types for the API response
interface LoginResponse {
  user: object | null;
  token: string | null;
  role: string | null;
  permissions: string[];
}

interface FetchError {
  message: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as object | null,
    token: null as string | null,
    roles: null as string | null,
    isLoading: false,
    permissions: [] as string[],
    error: null as string | null,
  }),
  getters: {
    check: (state) => state.user !== null && state.user !== undefined,
    isImpersonating: (state) => {
      if (import.meta.client) {
        return localStorage.getItem("token") !== null;
      }
      return false; // Default to false if on the server-side
    },
  },
  actions: {
    async login(email: string, password: string) {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;

      try {
        // Make the API call to login
        const { data, error } = await fetchData("/login", {
          baseURL: config.public.baseURL,
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        // Check for error or successful response
        if (!error.value) {
          // Safely cast data.value to LoginResponse
          const responseData = data.value as LoginResponse;
          this.user = responseData.user;
          this.token = responseData.token;
          this.roles = responseData.role;
          this.permissions = responseData.permissions;
          this.saveToLocalStorage(); // Save state to localStorage
        } else {
          // Safely cast error.value to FetchError
          const responseError = error.value as FetchError;
          this.error = responseError.message || "An error occurred";
        }
      } catch (err) {
        this.error = "An error occurred during login.";
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.roles = null;
      this.permissions = [];
      this.clearLocalStorage(); // Clear localStorage on logout
      return navigateTo("/login");
    },

    saveToLocalStorage() {
      if (import.meta.client) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: this.user,
            roles: this.roles,
            token: this.token,
            permissions: this.permissions,
          })
        );
        localStorage.setItem("token", this.token);
      }
    },

    loadFromLocalStorage() {
      if (import.meta.client) {
        const storedState = localStorage.getItem("auth");
        if (storedState) {
          const { user, token, roles, permissions } = JSON.parse(storedState);
          this.user = user;
          this.token = token;
          this.roles = roles;
          this.permissions = permissions;
        }
      }
    },

    clearLocalStorage() {
      if (import.meta.client) {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      }
    },

    init() {
      this.loadFromLocalStorage();
    },
  },
});
