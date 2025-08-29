export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResult) => {
    console.log({
      message,
      sender,
      sendResult,
    });

    const title = sender.tab!.title;

    sendResult({ success: true });
  });
});
