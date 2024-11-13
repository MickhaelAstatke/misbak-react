//@ts-nocheck
export interface ObjectInterface {
  [key: string]: string;
}

export const Mapping: ObjectInterface = {
  u: "ں",
  "7": "ں",
  n: "◠",
  "6": "◠",
  ",": "ر",
  "፣": "ر",
  ")": " ر",
  ";": "⋮",
  // "": "⋮",
  // "": "⋯",
  // "": " ̫ ",
  "~": "↼↼",
  "/": "↽↽",
  "1": "፩",
  "3": "፫",
  "30": "፴",
  "፫0": "፴",
  "10": "፲",
  "፩0": "፲",
  "00": "⁐",
  "100": "፻",
  // "": "",
  // "": "",
  // "": "",
  // "": "",
  // "": "",
  // "": "",
  // "": "",
};

export function sanitize(value: string) {
  // const arr = value.split("");

  // for (const key in arr) {
  //   if (!Mapping[arr[key]]) continue;
  //   value = value.replace(new RegExp(arr[key], "g"), Mapping[arr[key]]);
  // }

  for (const key in Mapping) {
    console.log(key);
    value = value.replaceAll(key, Mapping[key]);
  }

  return value;
}
