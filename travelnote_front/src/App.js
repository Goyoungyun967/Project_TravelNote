import { Route, Routes } from "react-router-dom";

import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Main from "./component/common/Main";
import ForeignMain from "./foreignPlan/ForeignMain";
import DomesticMain from "./component/Domestic/DomesticMain";
import CityDetail from "./component/Domestic/CityDetail";
import JoinUser from "./component/user/JoinUser";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content"></main>
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/foreign/*" element={<ForeignMain />}></Route>
          <Route path="/joinUser" element={<JoinUser />}></Route>
          <Route path="/Domestic/*" element={<DomesticMain />}></Route>
          <Route path="/city/:cityName" element={<CityDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
