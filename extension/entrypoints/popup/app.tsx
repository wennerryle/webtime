import { getCredentials, getPocketbaseURL } from "@/lib/Settings";
import { useSignal } from "@preact/signals";
import { ExtensionLink } from "@/components/ExtensionLink";
import { form2object, stopEvent } from "@/lib/dom";
import { CredentialsChanged, CredentialsChangedSchema } from "@/lib/Message";
import * as v from "valibot";

async function submitHandler(
  form: HTMLFormElement,
  event: SubmitEvent
): Promise<string[] | null> {
  stopEvent(event);
  const entries = form2object(form);
  entries["_tag"] = "credentials_changed_schema";

  const { success, issues, output } = v.safeParse(
    CredentialsChangedSchema,
    entries
  );

  if (!success) {
    return issues.map((it) => it.message);
  }

  await browser.runtime.sendMessage(output);

  return null;
}

export function App() {
  const dashboardURL = useSignal("");
  const button = useSignal("Save");
  const issues = useSignal<null | string[]>(null);
  const credentials = useSignal<CredentialsChanged | null>(null);

  getPocketbaseURL().then((it) => (dashboardURL.value = it));
  getCredentials().then((it) => {
    credentials.value = it;
  });

  async function onSubmit(this: HTMLFormElement, event: SubmitEvent) {
    button.value = "Upload..";

    console.log(this);

    const result = await submitHandler(this, event);
    issues.value = result;

    if (result !== null) {
      button.value = "Click here if you done";
    } else {
      button.value = "Successfully updated!";
    }
  }

  return (
    <main class="container">
      <nav>
        <ul>
          <li>
            <strong>WebTime Tracker</strong>
          </li>
        </ul>
        <ul>
          <li>
            <ExtensionLink href="https://github.com/wennerryle/webtime">
              About
            </ExtensionLink>
          </li>
          <li>
            <ExtensionLink href={dashboardURL.value + "_"}>
              Dashboard
            </ExtensionLink>
          </li>
        </ul>
      </nav>
      <article>
        <header>Your pocketbase credentials</header>
        <form
          onSubmit={(event) => {
            onSubmit.call(event.target! as HTMLFormElement, event);
          }}
        >
          <fieldset style="margin-bottom: 0">
            <input
              name="url"
              placeholder="Pocketbase URL"
              defaultValue={credentials.value?.url ?? "http://127.0.0.1:8090/"}
            />
            <input
              name="username"
              placeholder="Email"
              autocomplete="email"
              defaultValue={credentials.value?.username}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              defaultValue={credentials.value?.password}
            />
            {issues.value && (
              <article>
                <header style="background-color: #efa55b">
                  Fix your fields!
                </header>
                <ul>
                  {issues.value.map((issue) => (
                    <li>
                      {issue}
                      <br />
                    </li>
                  ))}
                </ul>
              </article>
            )}
            <input
              type="submit"
              value={button.value}
              style="margin-bottom: 0; height: max-value;"
            />
          </fieldset>
        </form>
      </article>
    </main>
  );
}
