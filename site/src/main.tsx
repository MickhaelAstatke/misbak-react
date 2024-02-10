//@ts-nochecks
import React from "react";
import ReactDOM from "react-dom/client";
import RootLayout from "./components/RootLayout.tsx";
import "./index.css";
import "./assets/AbyssinicaSIL-Regular.ttf";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Editor, {
  loader as dataLoader,
  action as updateAction,
} from "./components/Editor.tsx";
import NotFound from "./components/NotFound.tsx";
import App from "./components/App.tsx";
import AudioLyrics from "./components/AudioLyrics.tsx";
import VisualizerImp from "./components/Visualizer.tsx";

const queryParams = new URLSearchParams(window.location.search);
const prod = !!queryParams.get("prod");

let isDev = false;
try {
  isDev = import.meta.env.MODE == "development" && !prod;
} catch (e) {
  /* empty */
}

// console.log("prod", prod);
// console.log("isDev", isDev);
const router = createBrowserRouter([
  { path: "*", element: isDev ? <NotFound /> : <App /> },
  { path: "/lyrics", element: <AudioLyrics /> },
  { path: "/visualizer", element: <VisualizerImp /> },
  {
    path: "/",
    element: isDev ? <RootLayout /> : <App />,
    children: [
      {
        path: "/:week/:day",
        element: <Editor />,
        loader: dataLoader,
        action: updateAction,
        errorElement: <NotFound />,
        children: [
          {
            path: ":highlight",
            element: <Editor />,
            loader: dataLoader,
            action: updateAction,
            errorElement: <NotFound />,
          },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
