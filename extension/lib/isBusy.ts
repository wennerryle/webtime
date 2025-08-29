import {
  type Signal,
  type ReadonlySignal,
  signal,
  computed,
} from "@preact/signals";
import { IsIdle, IsIdleOptions } from "./isIdle";

export interface IsBusyOptions extends IsIdleOptions {
  onActiveEnd?: (durationMs: number) => void;
}

export class IsBusy {
  #current: ReadonlySignal<boolean>;
  #startActive: Signal<number> = signal(Date.now());
  #endActive: Signal<number> = signal(-1);
  #difference: ReadonlySignal<number> = computed(
    () => this.#endActive.value - this.#startActive.value
  );

  constructor({ onActiveEnd, ...rest }: IsBusyOptions) {
    const isIdle = new IsIdle(rest);

    this.#current = computed(() => !isIdle.current.value);

    this.#current.subscribe((active) => {
      // Signals are lazy, it means if it were setted to false twice
      // they will not emit subscribe event. So we definetely know that the previous
      // value of boolean was inverted
      if (active) {
        this.#startActive.value = Date.now();
      } else {
        this.#endActive.value = Date.now();
        onActiveEnd?.(this.#difference.peek());
      }
    });

    window.addEventListener("beforeunload", (e) => {
      this.#endActive.value = Date.now();
      onActiveEnd?.(this.#difference.peek());
    });
  }

  get current() {
    return this.#current;
  }

  get startActive() {
    return this.#startActive;
  }

  get endActive() {
    return this.#endActive;
  }
}
