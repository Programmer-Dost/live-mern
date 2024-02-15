import React from "react";
import { useRecoilValue } from "recoil";
import { todoList } from "../store/atoms/todoAtoms";
import TodoItemCreator from "./TodoItemCreator";
import TodoItem from "./TodoItem";

function TodoList() {
  const todoItems = useRecoilValue(todoList);
  return (
    <div>
      <TodoItemCreator />
      {todoItems.map((todoItem) => (
        <TodoItem key = {todoItem.id} item={todoItem} />
      ))}
    </div>
  );
}

export default TodoList;
