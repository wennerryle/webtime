import { IsBusy } from "@/lib/isBusy";
import { type TimeSpended } from "@/lib/Message";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    new IsBusy({
      onActiveEnd(timeSpendedMs) {
        browser.runtime.sendMessage<TimeSpended>({
          _tag: "time_spended_schema",
          timeSpended: timeSpendedMs / 1000,
        });
      },
      detectVisibilityChanges: true,
    });
  },
  runAt: "document_start",
});
