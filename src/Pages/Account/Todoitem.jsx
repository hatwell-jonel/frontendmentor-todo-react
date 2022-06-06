import React, { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase";
import { ref, remove, update } from "firebase/database";

function Todoitem({ todos }) {
  const [status, setStatus] = useState(false);

  const removeTodo = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`)).catch((error) =>
      console.error(error)
    );
  };

  const updateStatus = (uid) => {
    setStatus(!status);
    update(ref(db, `/${auth.currentUser.uid}/${uid}`), {
      completed: status,
    });
  };

  return (
    <>
      {todos.map((todo) => {
        return (
          <li
            className={`todo_item ${todo.completed ? "todo_item--done" : null}`}
            key={todo.id}
          >
            <div className="btn_container">
              <button
                type="button"
                className="btn_circle"
                onClick={() => updateStatus(todo.id)}
              >
                <BsCheckLg />
              </button>
            </div>
            <p className="todo_text" onClick={() => updateStatus(todo.id)}>
              {todo.todo}
            </p>
            <button
              type="button"
              className="btn_delete"
              onClick={() => removeTodo(todo.id)}
            >
              <FaTimes />
            </button>
          </li>
        );
      })}
    </>
  );
}

export default Todoitem;
