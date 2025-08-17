import MemeCoins from "@/app/memes";
import GetStarted from "@/components/getstarted";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white max-[500px]:w-full w-[100%] max-[500px]:px-[10px]">
            <GetStarted />
            <h1 className="text-[40px] font-bold text-center">New Trending Meme Coins</h1>
            <p className="text-[12px] text-center">Find the hottest meme coins trending right now!</p>
            <div class="pt-3 pl-4 flex items-center justify-center  px-4 text-sm">
         <div class="bg-secondaryDark lg:bg-highlighterBg text-white lg:rounded-lg p-4 w-full max-w-4xl grid gap-4 lg:grid-cols-[auto_1fr_auto] items-center relative">
    
  
    <div class="flex items-center gap-2 col-span-full lg:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="var(--color-success)" viewBox="0 0 16 16" height="24px" width="24px">
        <path fill-rule="evenodd" d="M11.77 7.56c.51 1.19.5 2.32-.14 2.96-1.03 1.03-3.29.45-5.04-1.3C4.84 7.45 4.25 5.2 5.3 4.17c.69-.7 1.94-.65 3.22-.02l.3-.4c-1.88-1-3.85-1.04-4.97.08-1.53 1.54-.91 4.64 1.39 6.93 2.3 2.3 5.4 2.92 6.93 1.39 1.14-1.15 1.09-3.17.02-5.08l-.41.48Z" clip-rule="evenodd" />
        <path d="M9.31 6.71H8.3a.26.26 0 0 1-.25-.15.25.25 0 0 1 .01-.28l2.22-3.14c.05-.06.1-.1.18-.12a.34.34 0 0 1 .22 0 .3.3 0 0 1 .17.14c.03.06.04.13.03.2l-.25 2.02h1.26c.12 0 .2.06.26.16.05.1.03.2-.05.3L9.64 8.7a.32.32 0 0 1-.39.09.34.34 0 0 1-.15-.13.3.3 0 0 1-.04-.2L9.3 6.7Z" />
      </svg>
      <span>Try our filters for a secure experience</span>
    </div>


    <div class="grid grid-cols-2 gap-2 col-span-full lg:col-span-1">
      <label class="flex items-center gap-2 cursor-pointer font-medium group">
        <input type="checkbox" class="h-4 w-4 accent-highlight" />
        <span class="text-grey1 group-hover:brightness-125 group-active:brightness-75 select-none">Hide Scams</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer font-medium group">
        <input type="checkbox" class="h-4 w-4 accent-highlight" />
        <span class="text-grey1 group-hover:brightness-125 group-active:brightness-75 select-none">Hide Rugs</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer font-medium group">
        <input type="checkbox" class="h-4 w-4 accent-highlight" />
        <span class="text-grey1 group-hover:brightness-125 group-active:brightness-75 select-none">Mint Auth Disabled</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer font-medium group">
        <input type="checkbox" class="h-4 w-4 accent-highlight" />
        <span class="text-grey1 group-hover:brightness-125 group-active:brightness-75 select-none">Freeze Auth Disabled</span>
      </label>
    </div>
  </div>
</div>


                <MemeCoins />
            </section>
        </>
    )
}
export default Trending