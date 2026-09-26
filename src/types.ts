export interface StoredVaktija {
  key: string;
  locationId: number;
  year: number;
  fetchedAt: number;
  data: unknown;
}

export interface Prayer {
  name: string;
  time: string;
}

export interface DayVaktija {
  date: Date;
  prayers: Prayer[];
  raw: unknown;
}

export interface NormalizedVaktija {
  year: number;
  days: DayVaktija[];
  raw: unknown;
}

export type Hadith = {
  text: string;
  source: string;
};

export const HADITHS: Hadith[] = [
  {
    text: "Prvo za šta će čovjek biti pitan na Sudnjem danu jeste namaz. Ako mu namaz bude ispravan, bit će mu ispravna i ostala djela.",
    source: "Tirmizi"
  },
  {
    text: "Između čovjeka i širka i kufra je ostavljanje namaza.",
    source: "Muslim"
  },
  {
    text: "Namaz je svjetlo.",
    source: "Muslim"
  },
  {
    text: "Pet dnevnih namaza brišu grijehe kao što voda briše prljavštinu.",
    source: "Buhari i Muslim"
  },
  {
    text: "Kada čovjek obavlja namaz, on razgovara sa svojim Gospodarom.",
    source: "Buhari"
  },
  {
    text: "Najdraža djela Allahu su namaz obavljen na vrijeme, dobročinstvo roditeljima i džihad na Allahovom putu.",
    source: "Buhari i Muslim"
  },
  {
    text: "Ko klanja sabah, on je pod Allahovom zaštitom.",
    source: "Muslim"
  },
  {
    text: "Ko klanja jaciju u džematu, kao da je proveo pola noći u namazu, a ko klanja sabah u džematu, kao da je proveo cijelu noć u namazu.",
    source: "Muslim"
  },
  {
    text: "Kada bi ljudi znali vrijednost jacije i sabaha, dolazili bi na njih makar pužući.",
    source: "Buhari i Muslim"
  },
  {
    text: "Najbolji namaz čovjeka je onaj koji obavlja u svojoj kući, osim obaveznih namaza.",
    source: "Buhari i Muslim"
  },
  {
    text: "Ko ode u džamiju ujutro ili navečer, Allah mu pripremi mjesto u Džennetu svaki put kada ode.",
    source: "Buhari i Muslim"
  },
  {
    text: "Ko se očisti u svojoj kući, a zatim ode u jednu od Allahovih kuća da obavi farz, jednim korakom mu se briše grijeh, a drugim podiže stepen.",
    source: "Muslim"
  },
  {
    text: "Namaz u džematu vredniji je od namaza pojedinca za dvadeset i sedam stepeni.",
    source: "Buhari i Muslim"
  },
  {
    text: "Kada se prouči ezan, šejtan bježi kako ne bi čuo ezan.",
    source: "Buhari i Muslim"
  },
  {
    text: "Između svakog od pet namaza, petkom do petka i ramazanom do ramazana brišu se grijesi između njih ako se klone velikih grijeha.",
    source: "Muslim"
  },
  {
    text: "Sedžda je trenutak u kojem je rob najbliži svome Gospodaru, zato u njoj mnogo upućujte dovu.",
    source: "Muslim"
  },
  {
    text: "Najbliže što je rob svome Gospodaru jeste kada je na sedždi.",
    source: "Muslim"
  },
  {
    text: "Kada čovjek klanja, grijesi mu se skidaju kao što lišće pada sa drveta.",
    source: "Ahmed"
  },
  {
    text: "Ko čuva svoje namaze, oni će mu biti svjetlo, dokaz i spas na Sudnjem danu.",
    source: "Ahmed"
  },
  {
    text: "Ko propusti namaz zbog sna ili zaborava, neka ga klanja kada ga se sjeti.",
    source: "Buhari i Muslim"
  }
];