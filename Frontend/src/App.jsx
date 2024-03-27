import Providers from "./providers/providers.jsx";
import AppRouter from "./router/router.jsx";
import "./styles/App.scss";

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
