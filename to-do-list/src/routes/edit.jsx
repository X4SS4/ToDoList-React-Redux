import {
    Form,
    useLoaderData,
    redirect,
    useNavigate,
} from "react-router-dom";
import { updateTask } from "../tasks";

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateTask(params.taskId, updates);
    return redirect(`/tasks/${params.taskId}`);
}

function EditTask() {
    const { task } = useLoaderData();
    const navigate = useNavigate();
    const now = `${new Date(task.createdAt)}`;

    return (
        <Form method="post" id="task-form">
            <p>
                <span>Title</span>
                <input
                    placeholder="Title"
                    aria-label="Title"
                    type="text"
                    name="title"
                    defaultValue={task.title}
                />
            </p>
            <label>
                <span>Creation date: </span>
                <p
                    type="text"
                    name="creationDate"
                >
                    {now}
                </p>
            </label>
            <label>
                <span>Description</span>
                <textarea
                    name="description"
                    defaultValue={task.description}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button
                    type="button"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Cancel
                </button>
            </p>
        </Form>
    );
}

export default EditTask;