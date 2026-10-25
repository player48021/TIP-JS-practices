console.log("A: синхронно");
setTimeout(() => console.log("F: таймер"), 0);
Promise.resolve().then(() => console.log("D: первая микрозадача"));
Promise.resolve().then(() => console.log("E: вторая микрозадача"));
console.log("B: синхронно");
console.log("C: синхронно");
