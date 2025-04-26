import MemeCoins from "@/app/memes";
import GetStarted from "@/components/getstarted";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white max-[500px]:w-full w-[100%] pt-[1270px] max-[500px]:pt-[1570px] max-[500px]:px-[10px]">
            <GetStarted />
            <h1 className="text-[40px] font-bold text-center">New Trending Meme Coins</h1>
            <p className="text-[12px] text-center">Find the hottest meme coins trending right now!</p>
                <MemeCoins />
            </section>
        </>
    )
}
export default Trending