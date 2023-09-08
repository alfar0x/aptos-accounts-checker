import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as stream from "stream";
import { once } from "events";

export const parseFilesLineByLine = async (filename: string) => {
  const lines: string[] = [];

  const pathToFile = path.resolve(`${filename}`);

  const instream = fs.createReadStream(pathToFile);
  const outstream = new stream.Writable();

  const rl = readline.createInterface(instream, outstream);

  rl.on("line", (line: string) => {
    lines.push(line);
  });

  await once(rl, "close");

  return lines;
};

const importAccounts = async () => {
  return parseFilesLineByLine("addresses.txt");
};

export default importAccounts;
