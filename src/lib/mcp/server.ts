import { McpServer } from "@modelcontextprotocol/server";

import { registerCourseTools } from "./tools/courses";
import { registerPlanTools } from "./tools/plans";

export function buildMcpServer(): McpServer {
  const server = new McpServer({
    name: "web-planer",
    version: "1.0.0",
  });

  registerPlanTools(server);
  registerCourseTools(server);

  return server;
}
