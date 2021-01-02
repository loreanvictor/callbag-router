export interface RoutingEnvironment {
  getUrl(): string;
  getQuery(): string;
  push(url: string, query?: string): void;
  onPop(callback: () => void): () => void;
}
