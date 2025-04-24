import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiLogoTelegram } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const Footer = ()=>{

    return(
        <>
            <footer className="w-[80%] h-fit bg-transparent text-white flex flex-col items-center justify-center py-[20px] gap-[30px] border-t-[0.3px] border-[#0c0d0f]">
                <section className="w-full h-fit flex max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-[20px] items-center justify-between ">
                    <div className="w-[288px] flex flex-col gap-[15px]">
                        <Link href={"/"}><Image
                            src="https://autosnipe.ai/_app/immutable/assets/logo_withtext_color.IDClpu_A.svg"
                            alt="Logo"
                            className="w-[118px]"
                            width={30}
                            height={30}
                        /></Link>
                        <p className="text-[16px] text-[#808080]">
                        Autosnipe Solana bot lets you buy and sell tokens at Hyperspeed!
                        </p>
                        <span className="flex gap-[10px] text-[20px]">
                            <BiLogoTelegram className="max-[500px]:hidden" />
                            <FaXTwitter className="max-[500px]:hidden" />
                        </span>
                    </div>
                    <ul className="text-[15px] flex flex-col gap-[5px]">
                        <li className="text-[17px] text-[#808080] pb-[10px]">TRADE</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Raydium Pairs</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Trending Pairs</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Pump.fun Pairs</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Moonshot Pairs</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">API Trading</li>
                    </ul>
                    <ul className="text-[15px] flex flex-col gap-[5px]">
                        <li className="text-[17px] text-[#808080] pb-[10px]">RESOURCES </li>
                        <li className="hover:text-[#00cc33] cursor-pointer">FAQs</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">How Copy Trading Works</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">How AI Sniper Works</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Stats on Dune</li>
                    </ul>
                    <ul className="text-[15px] flex flex-col gap-[5px]">
                        <li className="text-[17px] text-[#808080] pb-[10px]">LEGAL</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Fees</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-[#00cc33] cursor-pointer">Terms & Conditions</li>
                    </ul>
                </section>
                    <span className="text-[#808080] w-full flex items-center justify-start h-fit">
                        ©2025 Autosnipe . All rights Reserved <br></br>
                        Our charts are powered by TradingView
                    </span>
            </footer>
        </>
    )
}

export default Footer;