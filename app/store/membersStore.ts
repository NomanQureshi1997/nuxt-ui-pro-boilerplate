import { defineStore } from "pinia";
import { fetchData } from '~/services/api';

interface FetchError {
  message: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useMembersStore = defineStore("members", {
  state: () => ({
    users: [] as User[],
    roles: [] as string[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    // Add any necessary getters
  },
  actions: {
    async fetchRoles() {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // Fetch roles API call
        const { data, error } = await fetchData<Role[]>("/roles", {
          baseURL: config.public.baseURL,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!error.value) {
          this.roles = data.value?.map((role) => role.name) || [];
        } else {
          const responseError = error.value as FetchError;
          this.error =
            responseError.message || "An error occurred while fetching roles.";
        }
      } catch (err) {
        this.error = "An error occurred during the fetch operation.";
      } finally {
        this.isLoading = false;
      }
    },

    async addUser(user: any) {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // User payload
        const payload = {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        };

        // Add user API call
        const { data, error } = await fetchData("/users", {
          baseURL: config.public.baseURL,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
        });

        if (!error.value) {
        } else {
          this.error =
            error.value.data.message ||
            "An error occurred while adding the user.";
        }
      } catch (err) {
        this.error = "An error occurred during the user creation process.";
      } finally {
        this.isLoading = false;
      }
    },

    async getUsers() {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        // Get users API call
        const { data, error } = await fetchData<User[]>("/users", {
          baseURL: config.public.baseURL,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!error.value) {
          if (data.value == undefined) {
            this.users = [];
          } else {
            this.users = data.value.data;
          }
        } else {
          const responseError = error.value as FetchError;
          this.error =
            responseError.message || "An error occurred while fetching users.";
        }
      } catch (err) {
        this.error = "An error occurred during the fetch operation.";
      } finally {
        this.isLoading = false;
      }
    },

    async deleteUser(userId: number) {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // Delete user API call
        const { error } = await fetchData(`/users/${userId}`, {
          baseURL: config.public.baseURL,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!error.value) {
          this.getUsers();
        } else {
          const responseError = error.value as FetchError;
          this.error =
            responseError.message ||
            "An error occurred while deleting the user.";
        }
      } catch (err) {
        this.error = "An error occurred during the delete operation.";
      } finally {
        this.isLoading = false;
      }
    },
    async updateUser(userId: number, role: string) {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // Delete user API call
        const { error } = await fetchData(`/users/${userId}`, {
          baseURL: config.public.baseURL,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            role: role,
          }),
        });

        if (error.value) {
          const responseError = error.value as FetchError;
          this.error =
            responseError.message ||
            "An error occurred while deleting the user.";
        } else {
          this.getUsers();
        }
      } catch (err) {
        this.error = "An error occurred during the delete operation.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
