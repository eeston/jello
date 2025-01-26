import { Api } from "@jellyfin/sdk";

class ApiService {
  private api: Api | null = null;

  getApi(): Api | null {
    return this.api;
  }

  setApi(api: Api | null) {
    this.api = api;
  }
}

export const apiService = new ApiService();
