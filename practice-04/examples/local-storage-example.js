// Мини-пример сериализации данных для localStorage.
// Запускается в консоли браузера на странице практической работы.
const exampleTasks = [
  { id: 1, title: "Пример задачи", completed: false, priority: "medium" }
];
localStorage.setItem("tip-js-example", JSON.stringify({ version: 1, tasks: exampleTasks }));
const restored = JSON.parse(localStorage.getItem("tip-js-example"));
console.log("Восстановленные задачи:", restored.tasks);
