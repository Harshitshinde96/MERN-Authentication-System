import Header from "@/components/Header";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    // min-h-screen ensures it fills the viewport
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden relative selection:bg-purple-500/30">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;