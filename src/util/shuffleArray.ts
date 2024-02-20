/**
 * Fisher-Yates (also known as Knuth) Shuffle
 */
export const shuffleArray = (array: any[]): any[] => {
  const newArray = [...array];
  let currentIndex = newArray.length - 1;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];

    currentIndex--;
  }

  return newArray;
};
