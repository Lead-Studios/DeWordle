import Keyboard from "@/components/Keyboard.jsx";
import Navbar from "@/components/Navbar";
import WordGrid from "@/components/WordGrid";
export default function page() {
  return (
    <div>
    <Navbar/>
    <WordGrid/>
    <Keyboard />
    </div>
  );
}

