function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypedKeys<T>(obj: any): Array<T> {
    return Object.keys(obj) as Array<T>;
  }

export { getRandomInt, getTypedKeys }