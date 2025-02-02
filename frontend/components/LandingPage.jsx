import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div
      className="relative flex items-center justify-center w-full min-h-screen bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/dewordle-bg.jpg')" }}
    >
      {/* Lilac overlay */}
      <div className="absolute inset-0 bg-[#726c72] opacity-70"></div>

      <div className="z-10 md:mt-0 text-center max-w-[90%] sm:max-w-[80%] md:max-w-[60%]">
        {/* Logo */}
        <Image
          src="/icon.svg"
          alt="DEW-RDLE"
          width={350}
          height={50}
          className="mx-auto"
        />

        <p className="mt-4 text-3xl md:text-5xl text-white font-semibold">
          Get 6 Chances to <br /> guess a 5-letter word.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          {/* Log In Button */}
          <button className="px-6 py-3 w-full sm:w-[180px] md:w-[200px] h-[40px] md:h-[55px] text-base md:text-lg font-medium text-[#29296E] bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition border border-gray-400">
            Log In
          </button>

          {/* Play Button */}
          <Link href="/game" passHref>
            <button className="px-6 py-3 w-full sm:w-[180px] md:w-[200px] h-[40px] md:h-[55px] text-base md:text-lg font-medium text-white bg-[#29296E] rounded-full shadow-md hover:bg-blue-700 transition">
              Play
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
