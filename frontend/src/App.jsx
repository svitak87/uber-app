import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index.jsx";
import { useAuthStore } from "./store/auth.store.js";

const App = () => {
  // useEffect(() => {
  //   useAuthStore.getState().checkAuth();
  // }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;