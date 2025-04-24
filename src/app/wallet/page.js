"use client"
import MemeCoins from "@/components/memes";
import GetStarted from "@/components/getstarted";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white max-[500px]:w-full w-[115%] pt-[1270px] max-[500px]:pt-[1570px] max-[500px]:px-[10px]">
            {
                  localStorage.getItem("walletid") === '' ? (
                    <GetStarted />
                  ) : (
                  <section>
                    
                  </section>
                )
            }
            </section>
        </>
    )
}
export default Trending