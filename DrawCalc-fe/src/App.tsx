import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/screens/home";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@/index.css';

const paths = [  //Stores the URL paths and the corresponding components to be rendered
  {
    path: "/",
    element: (<Home />),
    
  },
]

const BrowserRouter = createBrowserRouter(paths); //Creates a router instance using the defined paths

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider> 
  );
}

export default App;
