import Snowflake from "../icons/Snowflake";
import MapPin from "../icons/MapPin";
import Mail from "../icons/Mail";
import Phone from "../icons/Phone";
import Chat from "../icons/Chat";
import YouTube from "../icons/YouTube";
import FaceBook from "../icons/FaceBook";
import TikTok from "../icons/TikTok";

export default function Footer() {
    return(
        <footer className="rounded-t-[50px] overflow-hidden bg-blue-2">
            <div className={`
                p-[30px_30px] grid grid-cols-[1fr_1fr_1fr] gap-[30px]
                max-[965px]:grid-cols-[1fr_1fr]
                max-[655px]:grid-cols-[1fr]
            `}>
                <div className={`
                    max-[655px]:flex max-[655px]:flex-col max-[655px]:items-center
                `}>
                    <div className={`
                        flex items-center gap-1 justify-self-start
                    `}>
                        <Snowflake color="white"/>
                        <p className="text-[25px] font-bold text-white">พลประกาย แอร์ เซอร์วิส</p>
                    </div>
                    <div className={`
                        mt-[10px]
                        max-[655px]:flex max-[655px]:justify-center max-[655px]:flex-wrap
                    `}>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">ติดตั้งแอร์ใหม่</span>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">ล้างแอร์</span>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">ย้ายแอร์</span>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">ตรวจเช็คระบบน้ำยา</span>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">ซ่อมแอร์</span>
                        <span className="mr-[10px] mt-[10px] text-[16px] text-white inline-block">วิเคราะห์อาการเสีย</span>
                    </div>
                    <div className={`
                        mt-[20px] flex flex-wrap gap-1
                        max-[655px]:flex max-[655px]:justify-center max-[655px]:flex-wrap
                    `}>
                        <MapPin color="white"/>
                        <span className="text-white">ชลบุรี: </span>
                        <span className="text-white">เมืองชลบุรี</span>
                        <span className="text-white">เสม็ด</span>
                        <span className="text-white">บ้านปึก</span>
                        <span className="text-white">ห้วยกะปิ</span>
                        <span className="text-white">อ่างศิลา</span>
                        <span className="text-white">บ้านสวน</span>
                        <span className="text-white">บางปลาสร้อย</span>
                        <span className="text-white">บางทราย</span>
                        <span className="text-white">และใกล้เคียง</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-[20px] font-bold text-white mt-[10px]">ติดต่อ</h2>
                    <div className={`
                        max-[655px]:flex max-[655px]:justify-center max-[655px]:flex-wrap max-[655px]:gap-2
                    `}>
                        <div className="flex items-center mt-[10px] gap-2">
                            <Phone color="white"/>
                            <p className="text-white">โทร: 098-267-1789</p>
                        </div>
                        <div className="flex items-center mt-[10px] gap-2">
                            <Chat color="white"/>
                            <p className="text-white">ไลน์: @064pjnra (มี @ ด้านหน้า)</p>
                        </div>
                        <div className="flex items-center mt-[10px] gap-2">
                            <Mail color="white"/>
                            <p className={`
                                text-white
                                max-[655px]:hidden
                            `}>อีเมล: tumairservice.chon@gmail.com</p>
                            <p className={`
                                hidden text-white
                                max-[655px]:block
                            `}>tumairservice.chon@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className={`
                    max-[965px]:col-span-2
                    max-[655px]:col-span-1
                `}>
                    <div className="flex flex-col items-center">
                        <h2 className="text-[20px] font-bold text-white mt-[10px]">ติดตาม</h2>
                        <div className="w-full">
                            <a href="https://www.facebook.com/profile.php?id=61588541855926&locale=th_TH" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center mt-[10px] gap-2 bg-[#126bfe] w-full p-[8px_10px] rounded-[30px]">
                                <FaceBook color="white"/>
                                <p className="text-white">FaceBook</p>
                            </a>
                            <div className="flex items-center justify-center mt-[10px] gap-2 bg-[#ff0033] w-full p-[8px_10px] rounded-[30px]">
                                <YouTube color="white"/>
                                <p className="text-white">YouTube</p>
                            </div>
                            <a href="https://www.tiktok.com/@tumair_chonburi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center mt-[10px] gap-2 bg-[#ffff] w-full p-[8px_10px] rounded-[30px]">
                                <TikTok color="white"/>
                                <p className="text-black">TikTok</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-[20px] border-t-2 border-white/10">
                <p className="text-white/50 text-center text-[14px]">© {new Date().getFullYear()} Pholprakai Air Service - Certified HVAC Specialists</p>
            </div>
        </footer>
    );
}
