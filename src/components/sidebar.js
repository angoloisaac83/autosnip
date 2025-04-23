"use client"
import React, { useState } from "react";
import { FaRocket } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import Link from "next/link";
import { MdOutlineRemoveRedEye } from "react-icons/md";

function SideBar({ open }){
    // alert(open)
// const [isOpen, setIsOpen] = useState(open);
    return(
        <>
            <div className={`bg-[#0c0d0f] transition-all ${open ? 'max-[500px]:left-[0px]' : ' max-[500px]:left-[-100%]'} max-[500px]:w-[100%] max-[500px]:items-center max-[500px]:justify-center text-[#cccccc] px-[20px] py-[20px] h-[90.1vh] max-[500px]:h-[90.5vh] z-[100] left-0 bottom-0 fixed w-[7.5%]`}>
                <ul className="flex flex-col text-[12px] w-full max-[500px]:items-center max-[500px]:justify-center gap-[10px]">
                    <Link href="/trending"><li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col max-[500px]:flex-row  max-[500px]:gap-[10px] items-center justify-center">
                        <FaRocket className="text-[20px]" />
                        <p>Trending</p>
                    </li></Link>
                    <Link href="/newpairs"><li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                        <BsGearFill className="text-[20px]" />
                        <p>New Pairs</p>
                    </li></Link>
                    <li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-5 h-5 group-hover:fill-primary fill-white"><path fill-rule="evenodd" d="M10 1.88c.4 0 .73.32.73.72v1.5a5.95 5.95 0 0 1 5.17 5.17h1.5a.73.73 0 0 1 0 1.46h-1.5a5.95 5.95 0 0 1-5.17 5.17v1.5a.73.73 0 1 1-1.46 0v-1.5a5.95 5.95 0 0 1-5.17-5.17H2.6a.73.73 0 1 1 0-1.46h1.5A5.95 5.95 0 0 1 9.27 4.1V2.6c0-.4.33-.73.73-.73ZM5.5 10a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0m3.05 0a1.45 1.45 0 1 1 2.9 0 1.45 1.45 0 0 1-2.9 0" clip-rule="evenodd"></path></svg>
                        <p>Trending</p>
                    </li>
                    <li className="w-[70px] max-[500px]:flex-row max-[500px]:w-fit max-[500px]:gap-[10px] hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <MdOutlineRemoveRedEye className="text-[20px]" />
                        <p>Trender Lens</p>
                    </li>
                    <li className="w-[70px] max-[500px]:flex-row max-[500px]:w-fit max-[500px]:gap-[10px] hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="w-5 h-5 group-hover:stroke-primary stroke-white"><path d="M6.68 6.15a1.32 1.32 0 1 0 2.65 0 1.32 1.32 0 0 0-2.65 0"></path><path d="M5.98 8.78c.21-.4.51-.73.86-.95A2.1 2.1 0 0 1 8 7.48c.4 0 .8.12 1.15.35.36.22.65.55.86.95"></path><path d="M16.33 16.3a1.15 1.15 0 0 1-1.15 1.15H4.85a1.15 1.15 0 0 1-1.15-1.14V3.68a1.15 1.15 0 0 1 1.15-1.15h7.46l4.02 4.02v9.76ZM5.98 11.71h8.04m-8.04 2.88h4.6"></path></svg>
                        <p>Copy Trade</p>
                    </li>
                    <li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                        <FaRocket className="text-[20px]" />
                        <p>Trending</p>
                    </li>
                    <li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                        <FaRocket className="text-[20px]" />
                        <p>Trending</p>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SideBar