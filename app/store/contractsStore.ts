import { defineStore } from "pinia";
import { fetchData } from '~/services/api';

interface FetchError {
  message: string;
}

export const useContractsStore = defineStore("contracts", {
  state: () => ({
    constracts: [] as any,
    roles: [] as string[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    // Add any necessary getters
  },
  actions: {
    async addContract(contact: any) {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // User payload
        const payload = {
          title: contact.title,
          description: contact.description,
          start_date: contact.startDate,
          end_date: contact.endDate,
          user_ids: contact.users.map((user: any) => user.id),
        };

        // Add user API call
        const { data, error } = await fetchData("/contracts", {
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
          this.getContracts();
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

    async getContracts() {
      const config = useRuntimeConfig();

      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        // Get users API call
        const { data, error }: any = await fetchData("/contracts", {
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
            this.constracts = [];
          } else {
            this.constracts = data.value.data;
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
  },
});
