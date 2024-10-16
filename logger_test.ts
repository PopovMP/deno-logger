import { ok, strictEqual } from "node:assert";
import { stderr, stdout } from "node:process";

import {
  getLastError,
  initLogger,
  logDebug,
  logError,
  logInfo,
  logSuccess,
  logText,
  logWarning,
} from "./mod.ts";

initLogger("", { suppress: [], tee: true });

let message = "";

console.log = (msg: string) => {
  message = msg;
  stdout.write(msg + "\n");
};

console.error = (msg: string) => {
  message = msg;
  stderr.write(msg + "\n");
};

Deno.test("logError", () => {
  logError("error message", "logger_test.ts");
  ok(message.includes("[ERROR]"));
  ok(message.includes("error message"));
  ok(message.includes("logger_test.ts"));
  strictEqual(getLastError(), "error message");
});

Deno.test("logDebug", () => {
  logDebug("debug message", "logger_test.ts");
  ok(message.includes("[DEBUG]"));
  ok(message.includes("debug message"));
  ok(message.includes("logger_test.ts"));
});

Deno.test("logWarning", () => {
  logWarning("warning message", "logger_test.ts");
  ok(message.includes("[WARNING]"));
  ok(message.includes("warning message"));
  ok(message.includes("logger_test.ts"));
});

Deno.test("logInfo", () => {
  logInfo("info message", "logger_test.ts");
  ok(message.includes("[INFO]"));
  ok(message.includes("info message"));
  ok(message.includes("logger_test.ts"));
});

Deno.test("logSuccess", () => {
  logSuccess("success message", "logger_test.ts");
  ok(message.includes("[SUCCESS]"));
  ok(message.includes("success message"));
  ok(message.includes("logger_test.ts"));
});

Deno.test("logText", () => {
  logText("text message");
  ok(message.includes("text message"));
});
