"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function ComingSoon() {
  const imageRef = useRef(null);
  useEffect(() => { 
    if(imageRef.current){
      gsap.to(imageRef.current,{
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
    }
  })
  return (
    <>
     <div className="flex justify-center items-center h-screen">
      <img ref={imageRef} src="coming-soon.png" alt="coming soon image" className="" />
    </div>
    </>
  );
}
