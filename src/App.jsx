import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ImageProvider } from './context/ImageContext';
import Home from './routes/Home';
import Group from './routes/Group';
import Preview from './routes/Preview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/group/:id',
    element: <Group />,
  },
  {
    path: '/preview',
    element: <Preview />,
  },
]);

export default function App() {
  return (
    <ImageProvider>
      <RouterProvider router={router} />
    </ImageProvider>
  );
}
