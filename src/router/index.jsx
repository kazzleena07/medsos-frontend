import { Navigate, useRoutes } from "react-router-dom";
import SideMenu from "../layouts/side-menu/Main";
import Page1 from "../views/content";
import Page2 from "../views/page-2";
import LoginPage from "../views/login";
import RegisterPage from "../views/register";
import ErrorPage from "../views/error-page";
import DetailContentPage from "../views/content/detail";

function Router() {
  const defaultRoute = [

  ]
  const getHomeRoute = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return "/home";
    } else {
      return "/login";
    }
  };
  const routes = [
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/",
      element: <SideMenu />,
      children: [
        {
          path: "/home",
          element: <Page1 />,
        },
        {
          path: "/detail-content/:id",
          element: <DetailContentPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
