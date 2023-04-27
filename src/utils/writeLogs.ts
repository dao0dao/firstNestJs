import { access, mkdir, writeFile } from "fs";
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
  writeFile(pathToFile, content, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

export async function writeErrorToLog(errors: ValidationError[]) {
  const checkFolder = new Promise<boolean>((resolve) => {
    access(logsFolderPath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
  const isFolderExist = await checkFolder;
  if (!isFolderExist) {
    mkdir(logsFolderPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  createErrorLog(errors);
}
