import "swiper/css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import MyRoutes from "./config/Routes"; // Use renamed Routes

function App() {
  return (
    <>
      <Header />
      <MyRoutes /> {/* Use the fixed Routes component */}
      <Footer />
    </>
  );
}

export default App;
