import { signal, type Signal } from "@preact/signals";
import { debounce } from "es-toolkit";

type WindowEvent = keyof WindowEventMap;

const DEFAULT_EVENTS = [
  "keypress",
  "mousemove",
  "touchmove",
  "click",
  "scroll",
] satisfies WindowEvent[];

interface IsIdleOptions {
  /**
   * The events that should set the idle state to `true`
   *
   * @default ['keypress', 'mousemove', 'touchmove', 'click', 'scroll']
   */
  events?: WindowEvent[];

  /**
   * The timeout in milliseconds before the idle state is set to `true`. Defaults to 60 seconds.
   *
   * @default 60000
   */
  timeout?: number;

  /**
   * Detect document visibility changes
   *
   * @default false
   */
  detectVisibilityChanges?: boolean;

  /**
   * The initial state of the idle property
   *
   * @default false
   */
  initialState?: boolean;
}

const DEFAULT_OPTIONS = {
  events: DEFAULT_EVENTS,
  timeout: 60_000,
  initialState: false,
} satisfies IsIdleOptions;

export class IsIdle {
  #current: Signal<boolean> = signal(false);
  #lastActive: Signal<number> = signal(Date.now());

  constructor(_opts?: IsIdleOptions) {
    const opts: IsIdleOptions = { ...DEFAULT_OPTIONS, ..._opts };

    const debouncedReset = debounce(() => {
      this.#current.value = true;
    }, opts.timeout!);

    debouncedReset();

    const handleActivity = () => {
      this.#current.value = false;
      this.#lastActive.value = Date.now();
      debouncedReset();
    };

    opts.events!.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    if (!opts.detectVisibilityChanges || !document) return;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      handleActivity();
    });
  }

  get current() {
    return this.#current;
  }

  get lastActive() {
    return this.#lastActive;
  }
}
