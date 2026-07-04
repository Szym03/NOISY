export const sounds = [
  {
    id: "pinknoise",
    title: "Pink Noise",
    category: "Noise",
    tint: [255, 105, 180],
    params: [],
  },
  {
    id: "forest",
    title: "Sounds of the Forest",
    category: "Soundscapes",
    tint: [120, 170, 90],
    params: [
      { id: "birdVolume", label: "Birds", default: 0.7 },
      { id: "windVolume", label: "Wind", default: 0.5 },
      { id: "streamVolume", label: "Stream", default: 0.6 },
      { id: "rustleVolume", label: "Leaves", default: 0.4 },
    ],
  },
];