import React, { useState } from "react";
import { todoList } from "../store/atoms/todoAtoms";
import { useSetRecoilState } from "recoil";

function TodoItemCreator() {
  const setToDoState = useSetRecoilState(todoList);
  const [inputValue, setInputValue] = useState("");
  const addTodo = () => {
    setToDoState((prev) => [
      ...prev,
      { id: getId(), text: inputValue, isComplete: false },
    ]);
    setInputValue("");
  };
  return (
    <div className="flex justify-around flex-col m-4">
      Manage Todos
      <div className="border-blue-400 w-fit m-4">
      <input
        type="text"
        value={inputValue}
        className="bg-gray-200 p-2 rounded"
        placeholder="Enter todo"
        
        onChange={(e) => setInputValue(e.target.value)}
      /></div>
      <button onClick={addTodo} className="border-2 border-blue-400 px-3 rounded-lg bg-gray-200 w-fit m-4">Add</button>
    </div>
  );
}
//getId
let id = 0;
function getId() {
  return id++;
}

export default TodoItemCreator;
