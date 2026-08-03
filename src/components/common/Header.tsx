import Snowflake from "../icons/Snowflake";
import MainMenu from "./MainMenu";
import Phone from "../icons/Phone";
import Chat from "../icons/Chat";

export default function Header() {
    return(
        <header className="fixed left-0 w-full z-100">
            <div>
                <div className="px-[20px] bg-white">
                    <div className={`
                        mx-auto max-w-[1440px] p-[20px_0px_10px_0px] grid grid-cols-2 items-center justify-items-center
                        max-[730px]:grid-cols-[5fr_1fr] 
                    `}>
                        <div className="flex items-center gap-1 justify-self-start">
                            <Snowflake color="var(--blue-1)"/>
                            <p className={`
                                text-2xl font-bold text-blue-1
                                max-[450px]:text-[20px]
                            `}>พลประกาย แอร์ เซอร์วิส</p>
                        </div>
                        <div className="justify-self-end">
                            <MainMenu/>
                        </div>
                    </div>

                </div>
                <div className={`
                    flex justify-between py-[5px] px-[20px] bg-blue-2
                    max-[420px]:hidden
                `}>
                    <div className="mx-auto w-[1440px] flex items-center justify-between">
                        <div className={`
                            flex items-center gap-2
                            max-[730px]:justify-center max-[730px]:w-full
                        `}>
                            <Phone color="white"/>
                            <p className={`
                                text-white
                                max-[830px]:text-[14px]
                            `}>โทร: 098-267-1789</p>
                            <div className={`
                                items-center gap-2 hidden
                                max-[730px]:flex
                            `}>
                                <Chat color="var(--green)"/>
                                <p className={`
                                    text-green
                                    max-[830px]:text-[14px] 
                                `}>ไลน์: @064pjnra (มี @ ด้านหน้า)</p>
                            </div>
                        </div>
                        <div className={`
                            flex items-center gap-2
                            max-[730px]:hidden
                        `}>
                            <Chat color="var(--green)"/>
                            <p className={`
                                text-green
                                max-[830px]:text-[14px] 
                            `}>ไลน์: @064pjnra (มี @ ด้านหน้า)</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}