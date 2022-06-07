import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Todoitem from "./Todoitem";
import { useAuth } from "../../AuthContext";

import { auth, db } from "../../firebase";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";

function Account() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read data
        const userRef = ref(db, `/${auth.currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          setTodos([]);
          const data = snapshot.val();

          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const inputTodo = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    writeToDatabase();
  };

  // write database
  const writeToDatabase = () => {
    const uidd = uid();
    if (input == "") return;
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      completed: false,
      todo: input,
      id: uidd,
    });
    setInput("");
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log(filter);
    const todo_item = document.querySelectorAll(".todo_item");

    // if (filter === "all") {
    //   todo_item.forEach((item) => {
    //     item.style.display = "flex";
    //     console.log("all");
    //   });
    // } else if (filter === "active") {
    //   todo_item.forEach((item) => {
    //     if (item.classList.contains("todo_item--done")) {
    //       item.style.display = "none";
    //       console.log("active");
    //     } else {
    //       item.style.display = "flex";
    //     }
    //   });
    // } else if (filter === "completed") {
    //   todo_item.forEach((item) => {
    //     if (item.classList.contains("todo_item--done")) {
    //       item.style.display = "flex";
    //       console.log("completed");
    //     } else {
    //       item.style.display = "none";
    //     }
    //   });
    // }
  };

  const itemsLeft = () => {
    let size = todos.reduce((a, b) => a + (b.completed !== true), 0);
    return size;
  };

  const clearAllCompleted = (todos) => {
    todos.forEach((todo) =>
      todo.completed
        ? remove(ref(db, `/${auth.currentUser.uid}/${todo.id}`)).catch(
            (error) => console.error(error)
          )
        : null
    );
  };

  return (
    <div className="todo">
      <div className="container">
        <section className="user_info">
          <h2>Hello, {user.displayName}</h2>
          <button onClick={handleSignOut}>logout</button>
        </section>
        <form id="todo_container" onSubmit={handleSubmit}>
          {/* intput todo   */}
          <div className="add_new_todo">
            <div className="btn_container">
              <button type="submit" className="enter_new_todo"></button>
            </div>
            <input
              type="text"
              placeholder="Create a new todo..."
              value={input}
              onChange={inputTodo}
            />
          </div>

          {/* todo list  */}
          <ul className="todo_list">
            <Todoitem todos={todos} input={input} />
          </ul>

          {/* filter todo   */}
          <div className="filter_container">
            <div className="items_left">{itemsLeft()} items left</div>

            <div className="filter_buttons">
              <button
                type="submit"
                value="all"
                className={`filter ${filter === "all" ? "selected" : null}`}
                onClick={(e) => handleFilter(e)}
              >
                all
              </button>
              <button
                type="submit"
                value="active"
                className={`filter ${filter === "active" ? "selected" : null}`}
                onClick={(e) => handleFilter(e)}
              >
                active
              </button>
              <button
                type="submit"
                value="completed"
                className={`filter ${
                  filter === "completed" ? "selected" : null
                }`}
                onClick={(e) => handleFilter(e)}
              >
                completed
              </button>
            </div>

            <button
              className="clear_done"
              onClick={() => clearAllCompleted(todos)}
            >
              Clear Completed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;
