"use strict";

const totalTasks = 11;
const tasksPerDay = 3;

if (!Number.isInteger(totalTasks) || totalTasks < 0 ||
    !Number.isInteger(tasksPerDay) || tasksPerDay <= 0) {
  console.error("Количество задач должно быть неотрицательным целым, а дневной лимит — положительным целым.");
} else {
  let remainingTasks = totalTasks;
  let day = 1;

  while (remainingTasks > 0) {
    const todayTasks = Math.min(tasksPerDay, remainingTasks);
    remainingTasks -= todayTasks;
    console.log(`День ${day}: выполнить ${todayTasks}, осталось ${remainingTasks}`);
    day += 1;
  }

  console.log(`Всего дней: ${day - 1}`);
}
