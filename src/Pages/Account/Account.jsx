import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Todoitem from "./Todoitem";
import { useAuth } from "../../AuthContext";
import { auth, db } from "../../firebase";
import { motion } from "framer-motion";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { VscTriangleDown } from "react-icons/vsc";
import { BsExclamationTriangleFill } from "react-icons/bs";

function Account() {
  const { logout, deleteAccount, user } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [modal, setModal] = useState(false);

  // SUBMIT FORM
  const handleSubmit = (e) => {
    e.preventDefault();
    writeToDatabase();
    handleFilter();
  };

  // DELETE THE ACCOUNT OF CURRENT USER
  const deleteCurrentUser = () => {
    deleteAccount();
  };

  // DRAG TODO ITEMS
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  // SIGNOUT THE CURRENT USER
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  // GET THE VALUE OF INPUTED TEXT IN TODO INPUT
  const inputTodo = (e) => {
    setInput(e.target.value);
  };

  // WRITE THE DATA IN REALTIME DATABASE
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

  //  FILTER TODOS
  const handleFilter = () => {
    const todo_item = document.querySelectorAll(".todo_item");
    if (filter === "all") {
      todo_item.forEach((item) => {
        item.style.display = "flex";
        console.log("all");
      });
    } else if (filter === "active") {
      todo_item.forEach((item) => {
        if (item.classList.contains("todo_item--done")) {
          item.style.display = "none";
          console.log("active");
        } else {
          item.style.display = "flex";
        }
      });
    } else if (filter === "completed") {
      todo_item.forEach((item) => {
        if (item.classList.contains("todo_item--done")) {
          item.style.display = "flex";
          console.log("completed");
        } else {
          item.style.display = "none";
        }
      });
    }
  };

  // COUNT THE ACTIVE TODO
  const itemsLeft = () => {
    let size = todos.reduce((a, b) => a + (b.completed !== true), 0);
    return size;
  };

  // DELETE ALL COMPLETED TODO
  const clearAllCompleted = (todos) => {
    todos.forEach((todo) =>
      todo.completed
        ? remove(ref(db, `/${auth.currentUser.uid}/${todo.id}`)).catch(
            (error) => console.error(error)
          )
        : null
    );
  };

  // DROPDOWN
  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  // MODAL
  const handleModal = () => {
    setModal(!modal);
  };

  // ANIMATION
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  // CHECK IF THERES A USER
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

  return (
    <motion.div
      className="todo"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className="container">
        <section className="user_info">
          <h2>Hello, {user.displayName}</h2>
          <button className="dropdown_btn" onClick={handleDropdown}>
            <VscTriangleDown />
          </button>

          <div className={`dropdown ${dropdown ? "dropdown-show" : null}`}>
            <button onClick={handleModal}>Delete Account</button>
            <button onClick={handleSignOut}>logout</button>
          </div>

          <div className={`${modal ? "modal" : "modal-close"}`}>
            <div className="modal_box">
              <div className="text_content">
                <div className="text_content-icon">
                  <BsExclamationTriangleFill id="danger-icon" />
                </div>
                <p>
                  After you have deleted this account, it will be permanently
                  <strong> deleted</strong>. Account cannot be recovered.
                </p>
              </div>
              <div className="modal_button">
                <button className="modal_button-no" onClick={handleModal}>
                  No
                </button>
                <button
                  className="modal_button-yes"
                  onClick={deleteCurrentUser}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <ul
                  className="todo_list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <Todoitem todos={todos} input={input} />
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          {/* filter todo   */}
          <div className="filter_container">
            <div className="items_left">{itemsLeft()} items left</div>

            <div className="filter_buttons">
              <button
                type="submit"
                value="all"
                className={`filter ${filter === "all" ? "selected" : null}`}
                onClick={(e) => setFilter(e.target.value)}
              >
                all
              </button>
              <button
                type="submit"
                value="active"
                className={`filter ${filter === "active" ? "selected" : null}`}
                onClick={(e) => setFilter(e.target.value)}
              >
                active
              </button>
              <button
                type="submit"
                value="completed"
                className={`filter ${
                  filter === "completed" ? "selected" : null
                }`}
                onClick={(e) => setFilter(e.target.value)}
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

          <p className="dnd">Drag and drop to reorder list</p>
        </form>
      </div>
    </motion.div>
  );
}

export default Account;

