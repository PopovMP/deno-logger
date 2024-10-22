import { ok, strictEqual } from "node:assert";
import { stderr, stdout } from "node:process";
import { test } from "node:test";

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

await initLogger("", { suppress: [], tee: true });

let message = "";

console.log = (msg: string) => {
  message = msg;
  stdout.write(msg + "\n");
};

console.error = (msg: string) => {
  message = msg;
  stderr.write(msg + "\n");
};

test("logError", () => {
  logError("error message", "logger_test.ts");
  ok(message.includes("[ERROR]"));
  ok(message.includes("error message"));
  ok(message.includes("logger_test.ts"));
  strictEqual(getLastError(), "error message");
});

test("logDebug", () => {
  logDebug("debug message", "logger_test.ts");
  ok(message.includes("[DEBUG]"));
  ok(message.includes("debug message"));
  ok(message.includes("logger_test.ts"));
});

test("logWarning", () => {
  logWarning("warning message", "logger_test.ts");
  ok(message.includes("[WARNING]"));
  ok(message.includes("warning message"));
  ok(message.includes("logger_test.ts"));
});

test("logInfo", () => {
  logInfo("info message", "logger_test.ts");
  ok(message.includes("[INFO]"));
  ok(message.includes("info message"));
  ok(message.includes("logger_test.ts"));
});

test("logSuccess", () => {
  logSuccess("success message", "logger_test.ts");
  ok(message.includes("[SUCCESS]"));
  ok(message.includes("success message"));
  ok(message.includes("logger_test.ts"));
});

test("logText", () => {
  logText("text message");
  ok(message.includes("text message"));
});
