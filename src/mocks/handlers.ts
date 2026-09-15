import { HttpResponse, http } from "msw";

export const handlers = [
  // biome-ignore lint/correctness/noUnusedFunctionParameters: This is required
  http.get("https://api.example.com/user", ({ request }) =>
    HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    })
  ),
];
