import { File } from 'node-fetch-native-with-agent';
import { realpathSync, readFileSync } from 'fs';

var InputFile = class {
  static fromBuffer(parts: BufferSource, name: string) {
    return new File([parts], name);
  }
  static fromPath(path: string, name: string) {
    const realPath = realpathSync(path);
    const contents = readFileSync(realPath);
    return this.fromBuffer(contents, name);
  }
  static fromPlainText(content: string, name: string) {
    const arrayBytes = new TextEncoder().encode(content);
    return this.fromBuffer(arrayBytes, name);
  }
};

export { InputFile };


