import { appendText } from "@popov/file-writer";

import { stat, writeFile } from "node:fs/promises";
import { EOL } from "node:os";

type Message = Error | object | string | number;

export interface LoggerOptions {
  tee?: boolean;
  suppress?: string[];
}

const loggerOptions: LoggerOptions = {
  tee: false,
  suppress: [],
};

let logPath = "";
let isInit = false;
let lastError: string | null = null;

const tagMap: Record<string, string> = {
  debug: "[DEBUG]",
  error: "[ERROR]",
  warning: "[WARNING]",
  info: "[INFO]",
  success: "[SUCCESS]",
  text: "",
};

const colors: Record<string, string> = {
  reset: "\x1b[0m", // reset
  debug: "\x1b[33m", // yellow
  warning: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  info: "",
  success: "\x1b[32m", // green
  text: "",
};

/**
 * Initializes the logger with the path to the log file.
 *
 * Options: { tee: boolean, suppress: string[] }
 *
 * If `tee` is true, the logger will write to the console and the log file.
 *
 * If `suppress` is an array of strings, the logger will not log the messages with these tags.
 */
export async function initLogger(
  logFilePath?: string,
  options?: LoggerOptions,
): Promise<void> {
  if (logFilePath) {
    logPath = logFilePath;
  }

  if (options?.tee) {
    loggerOptions.tee = options.tee;
  }

  if (Array.isArray(options?.suppress)) {
    loggerOptions.suppress = options.suppress;
  }

  isInit = true;

  if (logPath === "") {
    return;
  }

  try {
    const stats = await stat(logPath);
    if (!stats.isFile()) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error("Log path is not a file.");
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await writeFile(logPath, "", { encoding: "utf8" });
    } else {
      throw err;
    }
  }
}

/**
 * Logs an error message with tag [ERROR] in Red.
 *
 * If `tee` is true, the logger will write to the `stderr`.
 */
export function logError(message: Message, sender?: string): void {
  lastError = stringifyMessage(message);
  logMessage("error", message, sender);
}

/**
 * Logs a debug message with tag [DEBUG] in Yellow.
 */
export function logDebug(message: Message, sender?: string): void {
  logMessage("debug", message, sender);
}

/**
 * Logs a warning message with tag [WARNING] in Yellow.
 */
export function logWarning(message: Message, sender?: string): void {
  logMessage("warning", message, sender);
}

/**
 * Logs an info message with tag [INFO].
 */
export function logInfo(message: Message, sender?: string): void {
  logMessage("info", message, sender);
}

/**
 * Logs a success message with tag [SUCCESS] in Green.
 */
export function logSuccess(message: Message, sender?: string): void {
  logMessage("success", message, sender);
}

/**
 * Logs a text message.
 */
export function logText(message: Message): void {
  logMessage("text", message, "");
}

/**
 * Returns the last logged error message.
 */
export function getLastError(): Error | string | null {
  return lastError;
}

/**
 * Resets the last logged error message.
 */
export function resetLastError(value?: null): void {
  lastError = value || null;
}

function logMessage(tag: string, message: Message, sender?: string): void {
  if (loggerOptions.suppress && loggerOptions.suppress.includes(tag)) {
    return;
  }

  const text: string =
    ["info", "error", "debug", "warning", "success"].includes(tag)
      ? composeMessage(tag, message, sender)
      : String(message);

  if (isInit && logPath !== "") {
    try {
      appendText(logPath, text + EOL);
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  if (!isInit || loggerOptions.tee || logPath === "") {
    const msg = colors[tag] + text + colors.reset;
    if (tag === "error") {
      console.error(msg);
    } else {
      console.log(msg);
    }
  }
}

function composeMessage(
  tag: string,
  message: Message,
  sender?: string,
): string {
  const timeText = getLocalTimeText();
  const senderText = sender ? `[${sender}] ` : "";
  const messageText = stringifyMessage(message);

  return `${timeText} ${tagMap[tag]} ${senderText}${messageText}`;
}

function stringifyMessage(message: Message): string {
  if (typeof message === "object") {
    if (message instanceof Error) {
      return message.message;
    }

    return JSON.stringify(message, null, 2);
  }

  return String(message);
}

function getLocalTimeText(): string {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
