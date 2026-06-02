import { getContext } from "./src/git/context";
import { getDiff } from "./src/git/diff";

let currentData = `${await getContext()} \n The current git diffs are ${getDiff()}`;
console.log(currentData);
