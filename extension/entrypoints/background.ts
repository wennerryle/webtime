import {
  TimeSpendedSchema,
  CredentialsChangedSchema,
  type TimeSpended,
  type CredentialsChanged,
} from "@/lib/Message";
import {
  getCredentials,
  setPocketbasePassword,
  setPocketbaseURL,
  setPocketbaseUsername,
} from "@/lib/Settings";
import * as v from "valibot";
import PocketBase from "pocketbase";

const StatisticsCollectionName = "site_statistics";

type MessageSender = globalThis.Browser.runtime.MessageSender;

export default defineBackground(() => {
  let pb = new PocketBase("");

  getCredentials().then((it) => {
    if (it !== null) {
      pb = new PocketBase(it.url);

      pb.collection("_superusers").authWithPassword(it.username, it.password);
    }
  });

  async function credentialsChangedHandler(message: CredentialsChanged) {
    pb = new PocketBase(message.url);

    pb.collection("_superusers").authWithPassword(
      message.username,
      message.password
    );

    setPocketbasePassword(message.password);
    setPocketbaseURL(message.url);
    setPocketbaseUsername(message.username);
  }

  async function timeSpandedHandler(
    sender: MessageSender,
    { timeSpended }: TimeSpended
  ) {
    const { title, url } = sender.tab!;

    console.log({ timeSpended, title, url });

    try {
      const result = await pb.collection(StatisticsCollectionName).create({
        url,
        title,
        secondsSpended: timeSpended,
      });

      console.log(result);
    } catch (er) {
      console.log(er);
    }
  }

  browser.runtime.onMessage.addListener((message, sender) => {
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
