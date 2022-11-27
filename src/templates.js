import Echo from "./components/pages/Echo";
import DocsIntro from "./components/pages/Docs/Intro";

const templates = [
    {
        name: "echo",
        Component: Echo,
        // loader: () => import("./components/pages/Echo"),
    },
    {
        name: "docs-intro",
        Component: DocsIntro,
        // loader: () => import("./components/pages/Docs/Intro"),
    },
    {
        name: "hello-babylon",
        loader: () => import("./components/pages/HelloBabylon"),
    },
    {
        name: "hello-ground",
        loader: () => import("./components/pages/HelloGround"),
    },
    {
        name: "sea",
        loader: () => import("./components/pages/Sea"),
    }
]

export default templates;