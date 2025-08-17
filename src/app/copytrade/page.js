"use client"
import React, { useState } from "react";
import { IoWallet } from "react-icons/io5";
import WalletModal from '@/components/connectModal';

function CopyTrade(){
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };
    return(
        <>
            <section className="w-full max-[500px]:w-[400px] h-fit text-white flex flex-col py-[50px] items-center justify-center gap-[20px] border-b-[0.3px] border-[#0c0d0f]">
                <h1 className="text-[40px] max-[500px]:text-[30px] text-center max-[500px]:w-[200px]">
                    Copy Traders at <i className="text-[#00cc33] font-bold">Hyperspeed!</i> 
                </h1>
                <p className="text-[20px] text-[#808080] w-[390px] text-center pb-[20px]">Mirror buy & sell orders from targeted traders on Autosnipe</p>
                <div className="w-[714px] text-center items-center justify-center max-[500px]:flex-col flex flex-row gap-[20px]">
                    <div class="flex flex-col items-center w-[30%] relative"><img src="https://autosnipe.ai/_app/immutable/assets/step1.udBCdLvM.svg" alt="Step 1" height="32" width="32" class="mb-2 md:h-14 md:w-14" /> <div class="text-xs text-grey1 md:text-xl text-center max-w-40">Copy a target address from any platform</div></div>
                    <div class=" flex items-center w-[15%] -translate-x-1/2 justify-between"><div class="h-1 w-1 bg-grey2 rounded-full"></div> <div class="border-t border-grey2 border-dashed h-[1] w-full"></div> <div class="h-1 w-1 bg-grey2 rounded-full"></div></div>                
                    <div class="flex flex-col items-center w-[30%] relative"><img src="https://autosnipe.ai/_app/immutable/assets/step2.DfBDx9Ov.svg" alt="Step 2" height="32" width="32" class="mb-2 md:h-14 md:w-14" /> <div class="text-xs text-grey1 md:text-xl text-center max-w-40">Paste the target address below</div></div>
                    <div class=" flex items-center w-[15%] -translate-x-1/2 justify-between"><div class="h-1 w-1 bg-grey2 rounded-full"></div> <div class="border-t border-grey2 border-dashed h-[1] w-full"></div> <div class="h-1 w-1 bg-grey2 rounded-full"></div></div>                
                    <div class="flex flex-col items-center w-[30%] relative"><img src="https://autosnipe.ai/_app/immutable/assets/step3.BfhO-vzB.svg" alt="Step 3" height="32" width="32" class="mb-2 md:h-14 md:w-14" /> <div class="text-xs text-grey1 md:text-xl text-center max-w-40">Set your copy trading amount & Activate</div></div>
                </div>
                          <button onClick={openWalletModal}
                 className="flex items-center bg-[#00cc33] w-[314px] h-[56px] rounded-lg font-semibold text-black text-[19px] justify-center gap-[10px]"><IoWallet />Connect & Snipe</button>
            </section>
                    <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
        </>
    )
}

export default CopyTrade