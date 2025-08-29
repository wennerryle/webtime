import type { JSX } from "preact";

export function ExtensionLink({
  href,
  children,
  ...rest
}: JSX.AnchorHTMLAttributes) {
  return (
    <a
      href={href}
      {...rest}
      onClick={() => {
        browser.tabs.create({ active: true, url: href?.toString() });
      }}
    >
      {children}
    </a>
  );
}
