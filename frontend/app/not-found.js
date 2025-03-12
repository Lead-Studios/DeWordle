
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (

    <>
   
    <div className=" min-h-screen bg-white flex flex-col items-center justify-center h-screen text-center p-4 gap-4 ">

      <h1  className="text-9xl  text-[#6C6CAD] font-semibold " >404</h1>
      <h2 className="text-[32px] text-[#252525] font-semibold ">Page Not Found</h2>
      <p className=" text-2xl font-normal text-[#252525] ">we can’t seem to find the page you are looking for</p>

      <Link href="/" >
     <button className="mt-9 bg-[#29296E] w-[196px] h-[48px] rounded-3xl flex items-center justify-center gap-2 px-4 text-base font-semibold text-white  transform transition-transform hover:scale-110 " > <ArrowLeft/> <span>back home</span> </button>
     </Link>
      
    </div>
    </>
  );
}
