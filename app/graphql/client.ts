const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/graphql";

const AUTH_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const getAccessToken = (): string | undefined => {
  if (AUTH_TOKEN) return AUTH_TOKEN;
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
};

type RequestArgs = {
  document: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

export async function graphqlRequest<T>({
  document,
  variables,
  operationName,
}: RequestArgs): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      query: document,
      variables,
      operationName,
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload?.errors?.length) {
    const message =
      payload?.errors?.[0]?.message ??
      payload?.message ??
      response.statusText ??
      "Unknown GraphQL error";
    throw new Error(String(message));
  }

  return payload.data as T;
}

export const graphqlConfig = {
  endpoint: GRAPHQL_URL,
  hasAuth: Boolean(AUTH_TOKEN),
};
