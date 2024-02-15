import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { todoList } from "../store/atoms/todoAtoms";
interface todoItemType {
  id: number;
  text: string;
  isComplete: boolean;
}
interface todoItem {
  item: todoItemType;
}
function TodoItem({ item }: todoItem) {
  const [Todos, setTodos] = useRecoilState(todoList);

  //independent functions
  const index = Todos.findIndex((listItem) => listItem === item);

  function findAndReplaceTodo(
    arr: todoItemType[],
    index: number,
    newitem: todoItemType
  ) {
    return [...arr.slice(0, index), newitem, ...arr.slice(index + 1)];
  }
  function findAndDeleteTodo(arr: todoItemType[], index: number) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }

  //event handlers
  function modifyText(text: string) {
    let newitem = findAndReplaceTodo(Todos, index, { ...item, text: text });
    setTodos(newitem);
    console.log(text);
  }
  function removeTodo() {
    let newTodos = findAndDeleteTodo(Todos, index);
    setTodos(newTodos);
  }
  function toggleCheckbox() {
    let newitem = findAndReplaceTodo(Todos, index, {
      ...item,
      isComplete: !item.isComplete,
    });
    setTodos(newitem);
  }
  return (
    <div id={item.id.toString()} className="m-4">
      <input
        type="text"
        value={item.text}
        className="text-gray-500 m-2 bg-gray-200 rounded p-2"
        onChange={(e) => modifyText(e.target.value)}
        placeholder={item.text}
      />
      Completed
      <input
        type="checkbox"
        className="ml-2"
        checked={item.isComplete}
        onChange={toggleCheckbox}
        placeholder={item.isComplete ? "Completed" : "Not Completed"}
      />
      <button
        onClick={removeTodo}
        className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline m-4"
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
