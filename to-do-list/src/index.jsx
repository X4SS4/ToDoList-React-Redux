import React from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route
} from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Task, {
  loader as taskLoader,
  action as taskAction,
} from "./routes/task";
import EditTask, {
  action as editAction,
} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes";

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<Root />}
        loader={rootLoader}
        action={rootAction}
        errorElement={<ErrorPage />}
      >
        <Route errorElement={<ErrorPage />}>
          <Route index element={<Index />} />
          <Route
            path="tasks/:taskId"
            element={<Task />}
            loader={taskLoader}
            action={taskAction}
          />
          <Route
            path="tasks/:taskId/edit"
            element={<EditTask />}
            loader={taskLoader}
            action={editAction}
          />
          <Route
            path="tasks/:taskId/destroy"
            action={destroyAction}
          />
        </Route>
      </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);