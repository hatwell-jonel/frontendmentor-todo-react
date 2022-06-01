import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Todoitem from "./Todoitem";
import { useAuth } from "../../AuthContext";
import { BsCheckLg } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

function Account() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // console.log(todos.map((todo) => todo.id));

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

  // write data
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
            <Todoitem todos={todos} />

            {/* {todos.map((todo) => {
              return (
                <li className="todo_item">
                  <div className="btn_container">
                    <button className="btn_circle">
                      <BsCheckLg />
                    </button>
                  </div>
                  <p className="todo_text">{todo.todo}</p>
                  <button className="btn_delete">
                    <FaTimes />
                  </button>
                </li>
              );
            })} */}
          </ul>

          {/* filter todo   */}
          <div className="filter_container">
            <div className="items_left">{todos.length} items left</div>

            <div className="radio_button">
              <div className="radio_group">
                <input type="radio" name="filter" id="all" />
                <label htmlFor="all">All</label>
              </div>
              <div className="radio_group">
                <input type="radio" name="filter" id="active" />
                <label htmlFor="active">Active</label>
              </div>
              <div className="radio_group">
                <input type="radio" name="filter" id="completed" />
                <label htmlFor="completed">Completed</label>
              </div>
            </div>
            <button className="clear_done">Clear Completed</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;
