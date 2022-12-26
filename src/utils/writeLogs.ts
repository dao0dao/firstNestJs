import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "path";
import { ValidationError } from "class-validator";
import { logsFolderPath } from "src/utils/staticFiles";

function createErrorLog(errors: ValidationError[]) {
  let content = "";
  for (const e of errors) {
    const obj = {
      name: e.property,
      constraints: e.constraints,
      value: e.value,
    };
    content = content + e.toString() + JSON.stringify(obj) + "\n ----- \n";
  }
  const date = new Date();
  const fileName = date.toISOString().replace(/:/g, "-") + ".log";
  const pathToFile = join(logsFolderPath, fileName);
  writeFile(pathToFile, content, { encoding: "utf-8" });
}

export async function writeErrorToLog(errors: ValidationError[]) {
  const checkFolder = new Promise<boolean>((resolve) => {
    access(logsFolderPath)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
  const isFolderExist = await checkFolder;
  if (!isFolderExist) {
    await mkdir(logsFolderPath);
  }
  createErrorLog(errors);
}
