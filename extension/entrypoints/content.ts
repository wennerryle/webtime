import { IsBusy } from "@/lib/isBusy";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    new IsBusy({
      onActiveEnd(durationMs) {
        console.log(JSON.stringify({ durationMs }, null, 2));
      },
      timeout: 10_000,
    });
  },
  runAt: "document_start",
});
