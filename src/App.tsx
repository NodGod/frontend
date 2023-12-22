import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { WithNav, WithoutNav } from "./components/";

import OrganiserListView from "./views/Organiser/OrganiserListView";
import HomeView from "./views/Home/HomeView";
import EventListView from "./views/Event/EventListView";
import ItemListView from "./views/Item/ItemListView";
import LoginPage from "./views/Login/LoginPage";
import RegisterPage from "./views/Login/RegisterPage";
import UserListView from "./views/Users/UsersListView";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<WithNav />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/home" element={<HomeView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users" element={<UserListView />} />
            <Route path="/organisers" element={<OrganiserListView />} />
            <Route path="/organisers/:orgId/events" element={<EventListView />} />
            <Route path="/organisers/:orgId/events/:eventId/items" element={<ItemListView />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;