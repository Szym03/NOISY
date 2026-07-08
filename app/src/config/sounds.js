export const categories = [
  { id: "basic-noise", title: "basic noise", gradientFrom: "#919191", gradientTo: "#7AA3A0" },
  { id: "musical", title: "musical", gradientFrom: "#4F4090", gradientTo: "#7AA3A0" },
  { id: "ambience", title: "ambience", gradientFrom: "#016D40", gradientTo: "#7AA3A0" },
];

export const sounds = [
  {
    id: "whitenoise",
    title: "white",
    categoryId: "basic-noise",
    csdFile: "/sounds/whitenoise/whitenoise.csd",
    description:"White noise is often used to mask other sounds and block distractions. If it sounds too harsh, try other colors.",
    audioFiles: [],
    params: [],
  },
  {
    id: "pinknoise",
    title: "pink",
    categoryId: "basic-noise",
    csdFile: "/sounds/pinknoise/pinknoise.csd",
    description:"Pink noise is white noise with less high frequencies, similar to the sound of a waterfall.",
    audioFiles: [],
    params: [],
  },
  {
    id: "waves",
    title: "waves",
    categoryId: "basic-noise",
    csdFile: "/sounds/waves/generativesea.csd",
    description:"Randomly generated waves of noise, inspired by ocean sounds. Blends basic noise with organic movement and a sense of space.",
    audioFiles: [],
    params: [],
  },
  {
    id: "sinesong",
    title: "sine song",
    categoryId: "musical",
    csdFile: "/sounds/sinesong/sinesong.csd",
    description:"Calming harmony as a result of simple algorithmic counterpoint of three sine waves.",
    audioFiles: [],
    params: [],
  },
  {
    id: "mantra",
    title: "mantra",
    categoryId: "musical",
    csdFile: "/sounds/mantra/mantra.csd",
    description:"Blooming chords paired with soft bass and occasional percussive embelishments.",
    audioFiles: [],
    params: [],
  },
];