import { Route, Routes } from "react-router-dom";
import Diaries from "./diaries/Diaries";
import Header from "./header/Header";
import Home from "./home/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <header>
        <Header />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diaries" element={<Diaries />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
