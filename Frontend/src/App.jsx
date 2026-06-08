import AddVenue from "./Pages/Owner/AddVenue";
import { Outlet } from "react-router";
import { Route, createRoutesFromElements, createBrowserRouter } from "react-router";
import AddCategory from "./Pages/Admin/AddCategory";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/venue/add" element={<AddVenue />} />
      <Route path="/category/add" element={<AddCategory />} />
    </Route >
  ))

function App() {

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
