$ErrorActionPreference = "Stop"

$nodeBin = "C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
$pnpm = "C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm.cmd"

$env:Path = "$nodeBin;$env:Path"
& $pnpm run dev
