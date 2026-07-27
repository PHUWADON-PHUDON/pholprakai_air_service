import Snowflake from "../icons/Snowflake";
import MainMenu from "./MainMenu";
import Phone from "../icons/Phone";
import Chat from "../icons/Chat";
import Verify from "../icons/Verify";

export default function Header() {
    return(
        <header className="fixed left-0 w-full z-100">
            <div>
                <div className="px-[20px] bg-white">
                    <div className="mx-auto max-w-[1440px] p-[20px_0px_10px_0px] grid grid-cols-2 items-center justify-items-center">
                        <div className="flex items-center gap-1 justify-self-start">
                            <Snowflake color="var(--blue-1)"/>
                            <h1 className="text-2xl font-bold text-blue-1">พลประกาย แอร์ เซอร์วิส (uat)</h1>
                        </div>
                        <div className="justify-self-end">
                            <MainMenu/>
                        </div>
                        {/* <div className="justify-self-end">
                            asdfasdf
                        </div> */}
                    </div>

                </div>
                <div className="flex justify-between py-[5px] px-[20px] bg-blue-2">
                    <div className="mx-auto w-[1440px] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone color="white"/>
                            <p className="text-white">โทร: 098-267-1789</p>
                            <Chat color="var(--green)"/>
                            <p className="text-green">ไลน์: @064pjnra (มี @ ด้านหน้า)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Verify color="white"/>
                            <p className="text-white">ผ่านการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}