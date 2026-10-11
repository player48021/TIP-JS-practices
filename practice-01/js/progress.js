"use strict";

const totalTasks = 12;
const completedTasks = 7;

function isValidTaskCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= 1000;
}

if (!isValidTaskCount(totalTasks) || !isValidTaskCount(completedTasks)) {
  console.error("Количество задач должно быть целым числом от 0 до 1000.");
} else if (completedTasks > totalTasks) {
  console.error("Выполненных задач не может быть больше общего количества.");
} else {
  const remainingTasks = totalTasks - completedTasks;
  const percentage = totalTasks === 0 ? 0 : completedTasks / totalTasks * 100;
  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remainingTasks}`);
  console.log(`Прогресс: ${percentage.toFixed(1)}%`);
}
