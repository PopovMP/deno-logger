/**
 * #logger
 * 
 * **logger** is a straightforward, zero dependencies library for logging.
 * It logs to a single predefined file.
 * When an option `{tee: true}` is given, **logger** shows colored messages in the console.
 * If a log file is not defined, **logger** writes to the console only.
 * 
 * ## Synopsis
 * ```typescript
 * // Intialize `logger`in your index.js
 * import { initLogger, logInfo } from "jsr@popov/logger";
 * initLogger("~/logs/log.txt");
 * loggInfo("App started", "app::index");
 * 
 * // Use it in your other files
 * import  { logInfo, logError } from "jsr@popov/logger";
 * logError("Something went wrong", "app::index");
 * ```
 * 
 * 
 * ## Usage
 * 
 * **logger** must be initialized with the path to the log file in order to write the log.
 * It is a good idea to set the path relative to `__dirname`.
 * 
 * If you don't want the logger to write to a file, you may skip the `init` part or to call it without args.
 * The logger will only show the messages in the terminal in that case.
 * 
 * If **logger** is not initialized, it writes to the console.
 * It allows it to be used in modules without initialization.
 * 
 * You have to initialize the logger only once. It is best to do it in the application main script `index.js` or `app.js`.
 * 
 * **logger** writes to the log file asynchronously (aka Fire and Forget).
 * You can log only a message, or a message and sender. Sender can be a method name or other hint.
 * 
 * The methods `loggInfo`, `loggError` logs:
 * 
 *   - a date and time in [yyyy-dd-MM hh:mm:ss] format
 *   - tag `[INFO]` or `[ERROR]`. the tags help to search the log file or `grep` it by a tag.
 *   - sender (optional) in `[sender]` format (if provided).
 * 
 * The `loggText` method logs only the provided message. It doesn't log a date, a label or a sender.
 * 
 * ```typescript
 * import { initLogger, logInfo, logError, logText, getLastError } from "jsr@popov/logger";
 * initLogger("logs/log.txt", { tee: true, suppress: ["debug"] });
 * 
 * logInfo("Hello, World!");                          // => 2020-08-21 06:21:11 [INFO] Hello, World!
 * logInfo("GET index", "app::router");               // => 2020-08-21 06:21:11 [INFO] [app::router] GET index
 * logError("Ohh!", "bank::delete-account");          // => 2020-08-21 06:21:11 [ERROR] [bank::delete-account] Ohh!
 * logText("So Long, and Thanks for All the Fish!");  // => So Long, and Thanks for All the Fish!
 * ```
 * 
 * ## Last error
 * 
 * **logger** has two methods for getting and resetting the last logged error message: `getLastError` and `resetLastError`.
 * 
 * `getLastError` returns the last logged error message by the `logError` or `logger.error` methods.
 * 
 * You can reset the last error with the `resetLastError` method. When `resetLastError` is called without parameters,
 * it sets the last error to `undefined`. `resetLastError` can be called with `null` to set the last error to `null`.
 * 
 * 
 * @module logger
 */

export * from "./logger.ts";
