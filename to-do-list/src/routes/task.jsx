import {
  Form,
  useLoaderData,
  useFetcher,
} from "react-router-dom";
import { getTask, updateTask } from "../tasks";

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateTask(params.taskId, {
    isDone: formData.get("isDone") === "true",
  });
}

export async function loader({ params }) {
  const task = await getTask(params.taskId);
  if (!task) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { task };
}



function Task() {
  const { task } = useLoaderData();

  return (
    <div id="task">
      <div>
        <h1>
          {task.title ? (
            <>
              {task.title}
            </>
          ) : (
            <i>No Title</i>
          )}{" "}
          <Favorite task={task} />
        </h1>

        {task.createdAt && <p>Created at: {`${new Date(task.createdAt)}`}</p>}
        {task.description && <p>Description: {task.description}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ task }) {
  const fetcher = useFetcher();
  let isDone = task.isDone;
  if (fetcher.formData) {
    isDone = fetcher.formData.get("isDone") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="isDone"
        value={isDone ? "false" : "true"}
        aria-label={
          isDone
            ? "Remove from isDones"
            : "Add to isDones"
        }
      >
        {isDone ? "■" : "□"}
      </button>
    </fetcher.Form>
  );
}

export default Task;