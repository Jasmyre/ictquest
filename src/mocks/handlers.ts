import { HttpResponse, http } from "msw";

export const handlers = [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  http.get("https://api.example.com/user", ({ request }) =>
    HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    })
  ),
];

export const trpcHandlers = [];
