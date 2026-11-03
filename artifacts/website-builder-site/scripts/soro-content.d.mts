import type { IncomingMessage, ServerResponse } from "node:http";
export function handleSoroRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
