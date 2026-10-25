"use strict";

// Поставьте breakpoint на строке с remainingTasks и посмотрите значения переменных.
const totalTasks = 10;
const completedTasks = 4;
const remainingTasks = totalTasks - completedTasks;
const progress = totalTasks === 0 ? 0 : completedTasks / totalTasks * 100;

console.log({ totalTasks, completedTasks, remainingTasks, progress });
