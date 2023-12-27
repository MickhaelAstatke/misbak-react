import { DayEnum } from "./DayEnum";
import { FilsetaEnum } from "./FilsetaEnum";
import { HosaenaEnum } from "./HosaenaEnum";

export const WeekEnum = [
  {
    title: "ዘወረደ",
    key: "zewerede",
    child: DayEnum,
  },
  {
    title: "ቅድስት",
    key: "kidist",
    child: DayEnum,
  },
  {
    title: "ምኩራብ",
    key: "mkurab",
    child: DayEnum,
  },
  {
    title: "መፃጒዕ",
    key: "metsague",
    child: DayEnum,
  },
  {
    title: "ደብረ ዘይት",
    key: "debrezeyt",
    child: DayEnum,
  },
  {
    title: "ገብር ኄር",
    key: "gebrher",
    child: DayEnum,
  },
  {
    title: "ኒቆዲሞስ",
    key: "nikodimos",
    child: DayEnum,
  },
  {
    title: "ሆሣዕና",
    key: "hosaena",
    child: HosaenaEnum,
  },
  {
    title: "ፍልሰታ",
    key: "filseta",
    child: FilsetaEnum,
  },
];
