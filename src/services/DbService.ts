import { BusStop } from "./ApiService";

export interface DB {
  getApiKey: () => string;
  setApiKey: (apiKey: string) => void;
  deleteApiKey: () => void;

  getFavorites: () => BusStop[];
  setFavorites: (favorites: BusStop[]) => void;
}

export default class LocalDb implements DB {
  getApiKey() {
    return localStorage.getItem("apiKey") || "";
  }

  setApiKey(apiKey: string) {
    localStorage.setItem("apiKey", apiKey);
  }

  deleteApiKey() {
    localStorage.removeItem("apiKey");
  }

  getFavorites(): BusStop[] {
    const favorites = localStorage.getItem("favorites");
    if (!favorites) {
      return [];
    }

    return JSON.parse(favorites) as BusStop[];
  }

  setFavorites(favorites: BusStop[]) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
