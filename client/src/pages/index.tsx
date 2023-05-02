import Image from "next/image";
import { Inter } from "next/font/google";
import Gallery from "@/components/Gallery";
import Controllers from "@/components/Controllers";
import { logoBlue, logoWhite } from "../assets";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main
        className={`flex min-h-screen flex-col ${inter.className} p-4 lg:px-32 dark:bg-slate-800 dark:text-white relative`}
      >
        <div className="flex  place-content-between mb-6 p-2">
          <div className="flex items-center gap-4 ">
            <Image src={logoWhite} alt="logo" width={42} height={42} />
            <h1 className="text-4xl font-bold  flex gap-44">Image Engine</h1>
          </div>
        </div>
        <Controllers />
        {/* <Gallery /> */}

        <div className="w-8 h-8"></div>
        <footer className="bg-white rounded-lg shadow mt-auto dark:bg-slate-700">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between ">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2023{" "}
              {/* <a href="https://flowbite.com/" className="hover:underline">
                Flowbite™
              </a> */}
              All Rights Reserved.
              <span className="ml-4">
                💙 Made by{" "}
                <a
                  href="https://github.com/nic3rafs"
                  className="underline underline-offset-1 hover:text-blue-400"
                >
                  @nic3rafs
                </a>
              </span>
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  Me
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
}
