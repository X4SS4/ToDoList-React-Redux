import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getTasks, createTask } from "../tasks";
import { useState, useEffect } from "react";



export async function action() {
  const task = await createTask();
  return redirect(`/tasks/${task.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const tasks = await getTasks(q);
  return { tasks, q };
}



function Root() {
  const { tasks, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [filterValue, setFilterValue] = useState(null);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  const handleSelectChange = (event) => {
    if (event.currentTarget.value === "all") { setFilterValue(null) }
    else if (event.currentTarget.value === "done") { setFilterValue(true) }
    else if (event.currentTarget.value === "undone") { setFilterValue(false) }
  }

  return (
    <>
      <div id="sidebar">
        <h1>☆ To Do List ★</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search tasks"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <div>
          <select
            name="filter"
            id="filter-select"
            onChange={handleSelectChange}
          >
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="undone">Undone</option>
          </select>
        </div>
        <nav>
          {tasks.length ? (
            <ul>
              {tasks.filter(task => {
                return filterValue != null
                  ? task.isDone === filterValue
                  : task;
              }).map((task) => (
                <li key={task.id}>
                  <NavLink
                    to={`tasks/${task.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                          ? "pending"
                          : ""
                    }
                  >
                    {task.title ? (
                      <>
                        {task.title}
                      </>
                    ) : (
                      <i>No Title</i>
                    )}{" "}
                    {task.isDone && <span>■</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No Any Tasks</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}

export default Root;