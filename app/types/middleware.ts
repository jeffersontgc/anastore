export enum MiddlewareStatus {
  INVALID_TOKEN = "INVALID_TOKEN",
  EXPIRED_TOKEN = "EXPIRED_TOKEN",
  NO_ACCESS_RIGHTS = "NO_ACCESS_RIGHTS",
}

export type MiddlewareResponse = {
  canContinue: boolean;
  status?: MiddlewareStatus;
};
