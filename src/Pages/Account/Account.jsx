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
  const [filter, setFilter] = useState("");

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

  const filterTodos = () => {};

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  console.log(filter);

  const itemsLeft = () => {
    let size = todos.reduce(
      (prev, current) => prev + (current.completed !== true),
      0
    );
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

            <div className="radio_button">
              <div className="radio_group">
                <input type="radio" name="filter" value="all" />
                <label htmlFor="all">All</label>
              </div>
              <div className="radio_group">
                <input type="radio" name="filter" value="active" />
                <label htmlFor="active">Active</label>
              </div>
              <div className="radio_group">
                <input type="radio" name="filter" value="completed" />
                <label htmlFor="completed">Completed</label>
              </div>
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
