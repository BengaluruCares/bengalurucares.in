const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const ProgressBar = require("progress");

const cachePath = path.resolve(__dirname, "..", "bin");

(async () => {
  const refs = await fetch(
    "https://api.github.com/repos/BengaluruCares/scripts/git/refs/tags/latest"
  ).then(res => res.json());
  fs.mkdirSync(cachePath, { recursive: true });
  const sha = refs.object.sha;
  const metaPath = path.resolve(cachePath, "metadata.sha");
  let cachedSha = "";
  if (fs.existsSync(metaPath)) {
    cachedSha = fs.readFileSync(metaPath, { encoding: "utf-8" });
  }

  fs.writeFileSync(metaPath, sha, { encoding: "utf-8" });

  if (cachedSha !== sha) {
    const platform = process.platform === "darwin" ? "mac" : "linux";
    const res = await fetch(
      `https://github.com/BengaluruCares/scripts/releases/latest/download/bglcares.${platform}`
    );
    const binaryPath = path.resolve(cachePath, "bglcares");
    const len = parseInt(res.headers.get("content-length"), 10);
    const stream = fs.createWriteStream(binaryPath);
    res.body.pipe(stream);

    const bar = new ProgressBar("\tDownloading [:bar] :rate/bps Complete: :percent Remaing: :etas", {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: len,
    });

    res.body.on("data", chunk => {
      bar.tick(chunk.length);
    });

    res.body.on("end", () => {
      fs.chmodSync(binaryPath, 0o765);
    });
  }
})();
