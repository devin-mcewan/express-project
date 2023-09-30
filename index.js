const express = require("express");
const _ = require("lodash");
const app = express();
const todos = require("./todos.json");
let nextId = todos.length + 1;

app.use(express.json());

app.get("/api/todos", (req, res) => {
  console.log(req.query.completed);
  if (req.query.completed === "true") {
    console.log("query is true");
    const filteredTodos = todos.filter((todo) => {
      return todo.completed === JSON.parse(req.query.completed);
    });
    console.log(filteredTodos);
    res.status(200).send(filteredTodos);
  } else if (req.query.completed === "false") {
    console.log("query is false");
    const filteredTodos = todos.filter((todo) => {
      return todo.completed === JSON.parse(req.query.completed);
    });
    res.status(200).send(filteredTodos);
  }
  res.status(200).send(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id === Number(req.params.id));

  if (!todo) {
    return res.sendStatus(404);
  }

  res.json(todo);
});

app.post("/api/todos", (req, res) => {
  console.log(req.body);
  console.log(req.body.name);
  const newTodo = {
    id: nextId,
    name: req.body.name,
    completed: false,
  };
  todos.push(newTodo);
  nextId++;
  res.status(201).json(todos);
});

app.put("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id === Number(req.params.id));
  if (index < 0) {
    return res.sendStatus(404);
  }
  const todo = todos[index];
  const sanitizedBody = _.pick(req.body, ["name, completed"]);
  const newTodo = { ...todo, ...sanitizedBody };
  todos.splice(index, 1, newTodo);
  res.status(200).json(todos);
});

app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex(
    (todo) => todo.id === Number(req.params.id)
  );
  if (index < 0) {
    return res.status(200).json(todos);
  }
  todos.splice(index, 1);
  res.status(200).json(todos);
});

app.listen(5000, () => console.log("Express app started on port 5000"));
