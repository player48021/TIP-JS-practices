"use strict";

const sum = (a, b) => a + b;
console.log("1. Числа:", sum(2, 3));
console.log("1. Строка:", sum("2", 3));

const square = (value) => {
  return value * value;
};
console.log("2. square(4):", square(4));

const original = { title: "Задача" };
const reference = original;
reference.title = "Изменённая задача";
console.log("3. Общая ссылка:", original.title);

const tasks = [{ id: 1, title: "A" }, { id: 2, title: "B" }];
const copiedTasks = [...tasks];
copiedTasks[0].title = "Изменено";
console.log("4. Новый массив, но вложенный объект общий:", tasks[0].title);

const task = { id: 1, title: "Старое название" };
const updated = { ...task, title: "Новое название" };
console.log("5. Spread объекта:", task.title, "=>", updated.title);

function greet(name = "Студент") {
  return `Привет, ${name}!`;
}
console.log("6. Значения по умолчанию:", greet(), greet(undefined), greet(null), greet(""));
