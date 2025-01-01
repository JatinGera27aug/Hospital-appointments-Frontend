export const medicalQuotes = [
  {
    text: "The good physician treats the disease; the great physician treats the patient who has the disease.",
    author: "William Osler"
  },
  {
    text: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates"
  },
  {
    text: "The greatest mistake in the treatment of diseases is that there are physicians for the body and physicians for the soul, although the two cannot be separated.",
    author: "Plato"
  },
  {
    text: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates"
  }
];

export const getRandomQuote = () => {
  return medicalQuotes[Math.floor(Math.random() * medicalQuotes.length)];
};