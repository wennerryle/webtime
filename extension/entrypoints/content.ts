import { IsIdle } from "@/lib/isIdle";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    const isIdle = new IsIdle({ timeout: 2000, detectVisibilityChanges: true });

    isIdle.current.subscribe((it) => {
      console.log(JSON.stringify({ isIdle: it }, null, 2));
    });
  },
  runAt: "document_start",
});
