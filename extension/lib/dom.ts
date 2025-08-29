export function stopEvent(event: Event) {
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
}

export function form2object(it: HTMLFormElement) {
  console.assert(Boolean(it), "form2object got falsy value");

  const entries: Record<string, FormDataEntryValue | undefined> =
    Object.fromEntries(new FormData(it));

  console.log(JSON.stringify(entries), it);

  for (const key in entries) {
    if (entries[key] === "") {
      entries[key] = undefined;
    }
  }

  return entries;
}
