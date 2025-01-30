import Keyboard from "../../components/Keyboard.jsx";
import Navbar from "../../components/Navbar.jsx";
import WordGrid from "../../components/WordGrid.jsx";

export default function page() {
  return (
    <div>
      <Navbar />
      <WordGrid />
      <Keyboard />
    </div>
  );
}
