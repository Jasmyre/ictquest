import { http, HttpResponse } from "msw";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { trpcMsw } from "./trpcMsw";

export const handlers = [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  http.get("https://api.example.com/user", ({ request }) => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];

export const trpcHandlers = [];
