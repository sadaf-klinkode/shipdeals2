
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Plans from "../page/Plans";
import Rules from "../page/Rules";
import Tutorials from "../page/Tutorials";
import AddRule from "../page/AddRule";
import EditRule from "../page/EditRule";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Rules />
            },
            {
                path: '/add-rule/:id',
                element: <AddRule />
            },
            {
                path: '/edit-rule/code/:id/:type',
                element: <EditRule />,
                loader: ({ params }) => fetch(`/api/get-rule/code/${params.id}/${params.type}`)
            },
            {
                path: '/edit-rule/automatic/:id/:type',
                element: <EditRule />,
                loader: ({ params }) => fetch(`/api/get-rule/automatic/${params.id}/${params.type}`)
            },
            {
                path: '/video-tutorials',
                element: <Tutorials />
            },
            {
                path: '/plans',
                element: <Plans />
            },
        ]
    },

])

export default router;