'use client'
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const hideNavbar = pathname === "/";
  return (
    <main>
      <AppProvider>
        {!hideNavbar && <Navbar />}
        {children}
      </AppProvider>
    </main>
  );
};
export default Layout;
