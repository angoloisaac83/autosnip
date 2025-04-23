import GetStarted from "@/components/getstarted";
import MemeCoins from "@/components/memes";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white pt-[1270px] max-[400px]:pt-[1960px] max-[400px]:px-[10px]">
                <GetStarted />
                <h1 className="text-[40px] font-bold text-center">New Meme Coins</h1>
                <p className="text-[12px] text-center">Find the hottest meme coins trending right now!</p>
                <MemeCoins />
            </section>
        </>
    )
}
export default Trending