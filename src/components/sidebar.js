"use client"
import React, { useState } from "react";
import { FaRocket } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { IoWallet } from "react-icons/io5";
import Link from "next/link";
import { MdOutlineRemoveRedEye } from "react-icons/md";

function SideBar({ open }){
    // alert(open)
// const [isOpen, setIsOpen] = useState(open);
    return(
        <>
            <div className={`bg-[#080808] transition-all ${open ? 'max-[500px]:left-[0px]' : ' max-[500px]:left-[-100%]'} max-[500px]:w-[100%] max-[500px]:items-center max-[500px]:justify-center text-[#cccccc] px-[20px] py-[20px] h-[90.1vh] max-[500px]:h-[90.5vh] z-[100] left-0 bottom-0 fixed w-[7.5%]`}>
                <ul className="flex flex-col text-[12px] w-full max-[500px]:items-center max-[500px]:justify-center h-full py-[30px] items-center justify-between gap-[10px]">
                    <Link href="/trending"><li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col max-[500px]:flex-row  max-[500px]:gap-[10px] items-center justify-center">
                        <FaRocket className="text-[20px]" />
                        <p>Trending</p>
                    </li></Link>
                    <Link href="/newpairs"><li className="w-[60px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                        <BsGearFill className="text-[20px]" />
                        <p>New Pairs</p>
                    </li></Link>
                    <Link href="/wallet"><li className="w-[80px] max-[500px]:flex-row  max-[500px]:gap-[10px] max-[500px]:w-fit hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <IoWallet className="text-[20px]" />
                        <p>Wallet</p>
                    </li></Link>
                    <li className="w-[70px] max-[500px]:flex-row max-[500px]:w-fit max-[500px]:gap-[10px] hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <MdOutlineRemoveRedEye className="text-[20px]" />
                        <p>Trender Lens</p>
                    </li>
                    <Link href="/copytrade"><li className="w-[70px] max-[500px]:flex-row max-[500px]:w-fit max-[500px]:gap-[10px] hover:text-[#00cc33] hover:bg-[rgba(0,0,0,0.34)] cursor-pointer h-[60px] font-semibold rounded-md flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="w-5 h-5 group-hover:stroke-primary stroke-white"><path d="M6.68 6.15a1.32 1.32 0 1 0 2.65 0 1.32 1.32 0 0 0-2.65 0"></path><path d="M5.98 8.78c.21-.4.51-.73.86-.95A2.1 2.1 0 0 1 8 7.48c.4 0 .8.12 1.15.35.36.22.65.55.86.95"></path><path d="M16.33 16.3a1.15 1.15 0 0 1-1.15 1.15H4.85a1.15 1.15 0 0 1-1.15-1.14V3.68a1.15 1.15 0 0 1 1.15-1.15h7.46l4.02 4.02v9.76ZM5.98 11.71h8.04m-8.04 2.88h4.6"></path></svg>
                        <p>Copy Trade</p>
                    </li></Link>
                </ul>
            </div>
        </>
    )
}

export default SideBar