export class Logger {
  public static log(...args): void {
    Logger._('log', ...args);
  }

  public static info(...args): void {
    Logger._('info', ...args);
  }

  public static error(...args): void {
    Logger._('error', ...args);
  }

  public static debug(...args): void {
    Logger._('debug', ...args);
  }

  private static _(level: string, ...args): void {
    if (console && console.hasOwnProperty(level)) {
      const fn = console[level];
      if (fn instanceof Function) {
        fn.apply(fn, args);
      }
    }
  }
}
