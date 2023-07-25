export interface DB {
  getApiKey: () => string;
  setApiKey: (apiKey: string) => void;
  deleteApiKey: () => void;
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
}
