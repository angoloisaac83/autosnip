import MemeCoins from "@/components/memes";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white pt-[970px] max-[500px]:pt-[1570px] max-[500px]:px-[10px]">
            <h1 className="text-[40px] font-bold text-center">New Trending Meme Coins</h1>
            <p className="text-[12px] text-center">Find the hottest meme coins trending right now!</p>
                <MemeCoins />
            </section>
        </>
    )
}
export default Trending