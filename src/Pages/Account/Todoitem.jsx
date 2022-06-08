import React, { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase";
import { ref, remove, update } from "firebase/database";
import { Draggable } from "react-beautiful-dnd";

function Todoitem({ todos }) {
  const [status, setStatus] = useState(false);

  // DELETE A TODO ITEM
  const removeTodo = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`)).catch((error) =>
      console.error(error)
    );
  };

  // UPDATE THE STATUS OF A TODO ITEM
  const updateStatus = (uid) => {
    setStatus(!status);
    update(ref(db, `/${auth.currentUser.uid}/${uid}`), {
      completed: status,
    });
  };

  return (
    <>
      {todos.map((todo, index) => {
        return (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <li
                className={`todo_item ${
                  todo.completed ? "todo_item--done" : null
                }`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
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
            )}
          </Draggable>
        );
      })}
    </>
  );
}

export default Todoitem;
