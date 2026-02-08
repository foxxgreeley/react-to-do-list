import { useEffect, useState } from "react";
import "./App.css";
import { X } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const createID = () => self.crypto.randomUUID();

function useTodos() {
  const defaultTodos = [
    {
      id: createID(),
      text: "Learn JSX",
      completed: false,
    },
    {
      id: createID(),

      text: "Master State",
      completed: false,
    },
    {
      id: createID(),

      text: "Check of boxes",
      completed: false,
    },
  ];

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : defaultTodos;
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const resetTodos = () => {
    setTodos(defaultTodos);
  };

  const addTodo = (text: string) => {
    if (!text) {
      return;
    }
    setTodos((todos) => [...todos, { id: createID(), text, completed: false }]);
  };

  const deleteTodo = (id: string) =>
    setTodos((todos) => todos.filter((todo) => todo.id !== id));

  const completeTodo = (id: string) =>
    setTodos((todos: TodoItem[]) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

  return {
    todos,
    resetTodos,
    addTodo,
    deleteTodo,
    completeTodo,
  };
}

function App() {
  const { todos, resetTodos, addTodo, deleteTodo, completeTodo } = useTodos();

  return (
    <>
      <main className="bg-neutral-700 px-10 py-8 w-full max-w-xl mx-auto geist antialiased">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col text-center">
            <h1 className="text-2xl font-semibold">Simple Todo List</h1>
            <p className="text-lg font-light">
              Todos Left: {todos.filter((todo) => !todo.completed).length}
            </p>
          </div>
          <ul className="flex flex-col gap-4 my-3">
            {todos.map((todo) => (
              <ToDoListItem
                key={todo.id}
                todo={todo}
                completeTodo={() => completeTodo(todo.id)}
                deleteTodo={() => deleteTodo(todo.id)}
              />
            ))}
          </ul>

          <Form addTodo={addTodo} />
          <button
            className="w-full hover:cursor-pointer bg-neutral-800 px-2 py-1 rounded-md"
            onClick={() => resetTodos()}
          >
            Reset
          </button>
        </div>
      </main>

      <footer className="text-center font-extralight my-4">
        Made by Foxx Greeley
      </footer>
    </>
  );
}

function Form({ addTodo }: { addTodo: (text: string) => void }) {
  const [newTodoText, setNewTodoText] = useState("");

  return (
    <form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        addTodo(newTodoText);
        setNewTodoText("");
      }}
    >
      <div className="flex justify-between">
        <input
          className="bg-white text-black flex-1 p-3"
          type="text"
          placeholder="Take out the trash..."
          required
          onChange={(e) => setNewTodoText(e.target.value)}
          value={newTodoText}
        />
      </div>
      <button
        className="w-full mt-3 hover:cursor-pointer bg-neutral-800 px-2 py-1 rounded-md"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

function ToDoListItem({
  todo,
  completeTodo,
  deleteTodo,
}: {
  todo: TodoItem;
  completeTodo: () => void;
  deleteTodo: () => void;
}) {
  return (
    <>
      <li className="flex gap-2 items-center justify-between w-full">
        <p className={`w-full ${todo.completed ? "line-through" : ""}`}>
          {todo.text}
        </p>
        <input
          className="size-6"
          type="checkbox"
          checked={todo.completed}
          onChange={() => completeTodo()}
          required
        />
        <button
          className="text-white hover:text-red-500 hover:cursor-pointer"
          onClick={() => deleteTodo()}
        >
          <X className="size-6" />
        </button>
      </li>
    </>
  );
}

export default App;
