import { $, fs } from "zx";

function build() {
  return Promise.all([
    $`cd extension && npm run build`,
    $`cd extension && npm run build:firefox`,
    $`cd server && npx goreleaser release --snapshot --clean`,
  ]);
}

async function zipExtensions() {
  const targets = ["chrome-mv3", "firefox-mv2"];

  await Promise.all(
    targets.map(
      (target) =>
        $`7z a -ttar ./artefact/${target}.tar ./extension/.output/${target}`
    )
  );

  await Promise.all(
    targets.map(
      (target) =>
        $`7z a -tgzip ./artefact/extension-${target}.tar.gz ./artefact/${target}.tar -sdel`
    )
  );

  await Promise.all(
    targets.map(
      (target) =>
        $`7z a ./artefact/extension-${target}.zip ./extension/.output/${target}`
    )
  );
}

await Promise.all([build(), fs.mkdir("./artefact", { recursive: true })]);

const targets = [
  "webtime_Darwin_arm64.tar.gz",
  "webtime_Darwin_x86_64.tar.gz",
  "webtime_Linux_arm64.tar.gz",
  "webtime_Linux_i386.tar.gz",
  "webtime_Linux_x86_64.tar.gz",
  "webtime_Windows_arm64.zip",
  "webtime_Windows_i386.zip",
  "webtime_Windows_x86_64.zip",
];

const copyTargets = targets.map((it) =>
  fs.move("./server/dist/" + it, "./artefact/server_" + it)
);

await Promise.all([...copyTargets, zipExtensions()]);
