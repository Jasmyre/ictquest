import { createTRPCMsw } from "msw-trpc";
import type { AppRouter } from "@/server/api/root";

export const trpcMsw = createTRPCMsw<AppRouter>({
  links: [], // leave blank or match your client links, optional
});
