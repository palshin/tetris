export const Random = {
  number(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max + 1));
  },

  arrayElement<T>(items: readonly T[]): T {
    const randomIndex = this.number(0, items.length - 1);

    return items[randomIndex];
  },

  arrayElements<T>(items: readonly T[], count = 2): T[] {
    const copyItems = [...items];
    const randomElements: T[] = [];
    while (randomElements.length < count && copyItems.length > 0) {
      const randomIndex = this.number(0, copyItems.length - 1);
      randomElements.push(copyItems[randomIndex]);
      copyItems.splice(randomIndex, 1);
    }

    return randomElements;
  },
};
