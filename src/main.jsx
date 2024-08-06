import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom/dist"
import App from './App';
import MusicEditor from "./components/MusicEditor";
import Circle5th from "./components/Circle5th"
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    error: <Error />,
    children: [
      {
        index: true,
        element: <MusicEditor />
      }, {
        path: "/earTraining",
        element: <Circle5th />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)