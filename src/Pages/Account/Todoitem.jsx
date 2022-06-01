import React, { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase";
import { ref, remove, update, push, child } from "firebase/database";

function Todoitem({ todos }) {
  const [status, setStatus] = useState(false);

  // remove data
  const removeTodo = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
      .then(alert("Todo deleted."))
      .catch((error) => console.error(error));
  };

  // const updateStatus = (uid) => {
  //   update(ref(db, `/${auth.currentUser.uid}/${uid}`), {
  //     completed: setStatus(!status),
  //   });
  // };

  return (
    <>
      {todos.map((todo) => {
        return (
          <li
            className={`todo_item ${status ? "todo_item--done" : null}`}
            key={todo.id}
          >
            <div className="btn_container">
              <button type="button" className="btn_circle">
                <BsCheckLg />
              </button>
            </div>
            <p className="todo_text">{todo.todo}</p>
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
