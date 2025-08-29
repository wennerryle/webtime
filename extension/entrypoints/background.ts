import {
  TimeSpendedSchema,
  CredentialsChangedSchema,
  type TimeSpended,
  type CredentialsChanged,
} from "@/lib/Message";
import { getCredentials } from "@/lib/Settings";
import * as v from "valibot";

type MessageSender = globalThis.Browser.runtime.MessageSender;

export default defineBackground(async () => {
  let credentials = await getCredentials();

  async function credentialsChangedHandler({
    _tag,
    ...message
  }: CredentialsChanged) {
    credentials = { ...credentials, ...message };
  }

  async function timeSpandedHandler(
    sender: MessageSender,
    { timeSpended }: TimeSpended
  ) {
    const { title, url } = sender.tab!;

    console.log({ timeSpended, title, url });
  }

  browser.runtime.onMessage.addListener((message, sender, sendResult) => {
    const timeSpanded = v.safeParse(TimeSpendedSchema, message);

    if (timeSpanded.success) {
      timeSpandedHandler(sender, timeSpanded.output);
      return;
    }

    const credentialsChanged = v.safeParse(CredentialsChangedSchema, message);

    if (credentialsChanged.success) {
      credentialsChangedHandler(credentialsChanged.output);
      return;
    }
  });
});
