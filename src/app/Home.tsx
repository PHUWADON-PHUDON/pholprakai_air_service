import Mail from "@/components/icons/Mail";
import Header from "../components/common/Header";
import Chat from "@/components/icons/Chat";
import Phone from "@/components/icons/Phone";
import ImageSlider from "@/components/common/ImagesSlide";
import ImageMarquee from "@/components/common/ImagesMarquee";
import Toolbox from "@/components/icons/Toolbox";
import ImagesActivity from "@/components/common/ImagesActivity";
import VideoEmbedUrl from "@/components/common/VideoEmbedUrl";
import Btucal from "@/components/common/Btucal";
import CircleAlert from "@/components/icons/CircleAlert";
import Footer from "@/components/common/Footer";
import Verify from "@/components/icons/Verify";

export default function Home() {
    const images = [
        "002.png", "004.png", "005.png", "006.png", "007.png", "008.png"
    ];

    const imagesLogo = [
        "daikin_logo.webp", "Mitsubishi_Electric_logo.png", "Fujitsu-Logo.svg.webp", "Panasonic_logo_(Blue).svg.webp", "Hitachi_inspire_the_next-Logo.svg.webp",
        "Logo-AMENA.png", "Toshiba_logo.svg.webp", "tc-horiz-red-logo.png", "Logo_of_the_Carrier_Corporation.svg.webp", "York.png",
        "samsung-classic-text-logo-6.png", "LG_logo_(2014).svg.webp", "Centralair-thailand-2026.webp", "Haier_logo.svg.webp", "tcl-logo-1.png",
        "gree-logo.png", "eminent-logo.png", "STAR-Air.png", "logo.webp", "Sharp-Logo.webp", "midea-logo.png", "auxlogo.png", "uniair.png",
        "unimaster.webp", "MDV.png", "daisenko.png", "General.png", "Z7_Frio_Logo.webp", "comfee.png", "Hisense.webp", "focus.jpg"
    ];

    const activityImages = [
        "706851728_122114723973284728_5174665860920710053_n.jpg","710245564_122115138093284728_6495996020355849104_n.jpg",
        "718398127_122115959535284728_7594643191217718466_n.jpg","727757546_122117145357284728_4849607878032151604_n.jpg",
        "733195594_122117903529284728_4032935321641781855_n.jpg","646323612_122103005679284728_1432091657375188475_n.jpg",
        "646351071_122103006075284728_3095514218436899517_n.jpg","647517028_122103005631284728_5619330593670024989_n.jpg"
    ];

    const videoUrl = [
        "https://www.facebook.com/reel/4196149790675954",
    ];

    return(
        <div>
            <Header/>
            <div id="" className={`
                relative pt-[200px] pb-[50px] overflow-hidden flex
                max-[750px]:pt-[150px]
                max-[480px]:pt-[120px] max-[480px]:pb-[30px]
                max-[420px]:pt-[80px]
            `}>
                <img 
                    src="./wave_background_pattern.svg" alt="" 
                    className={`
                        absolute block w-full h-full object-cover border scale-[1.1] top-[95px] opacity-50 left-0 z-[-1]
                        max-[420px]:top-[0px]
                    `}
                    style={{
                        maskImage: "linear-gradient(to right, transparent 0%, black 70%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 70%, transparent 100%)"
                    }}
                />
                <div className={`
                    p-[20px]
                    max-[480px]:flex max-[480px]:flex-col max-[480px]:items-center
                `}>
                    <p className={`
                        text-[40px]
                        max-[860px]:text-[30px]
                        max-[480px]:text-[25px]
                        max-[395px]:text-[20px]
                    `}>ร้านแอร์ชลบุรี</p>
                    <p className={`
                        text-[50px] font-bold text-blue-2
                        max-[860px]:text-[40px]
                        max-[480px]:text-[35px]
                        max-[395px]:text-[30px]
                    `}>พลประกาย แอร์ เซอร์วิส</p>
                    <div className={`
                        max-[480px]:flex max-[480px]:justify-center max-[480px]:flex-wrap
                    `}>
                        <span className={`
                            mr-[10px] mt-[10px] text-[20px]
                            max-[430px]:text-[16px]
                        `}>ติดตั้งแอร์ใหม่</span>
                        <span className={`
                            mr-[10px] mt-[10px] text-[20px]
                            max-[430px]:text-[16px]
                        `}>ย้ายแอร์</span>
                        <span className={`
                            mr-[10px] mt-[10px] text-[20px]
                            max-[430px]:text-[16px]
                        `}>เช็ครั่ว เติมน้ำยา</span>
                        <span className={`
                            mr-[10px] mt-[10px] text-[20px]
                            max-[430px]:text-[16px]
                        `}>ตรวจเช็ค วิเคราะห์อาการเสีย</span>
                        <span className={`
                            mr-[10px] mt-[10px] text-[20px]
                            max-[430px]:text-[16px]
                        `}>อื่นๆ...</span>
                    </div>
                    <div className={`
                        flex items-center mt-[10px] gap-2 hidden
                        max-[420px]:flex
                    `}>
                        <Phone color="var(--text)"/>
                        <p className={`
                            text-[20px]
                            max-[430px]:text-[16px]
                            max-[355px]:text-[14px]
                        `}>โทร: 098-267-1789</p>
                    </div>
                    <div className={`
                        flex items-center mt-[10px] gap-2 hidden
                        max-[420px]:flex
                    `}>
                        <Chat color="var(--text)"/>
                        <p className={`
                            text-[20px]
                            max-[430px]:text-[16px]
                            max-[355px]:text-[14px]
                        `}>ไลน์: @064pjnra (มี @ ด้านหน้า)</p>
                    </div>
                    <div className="flex items-center mt-[10px] gap-2">
                        <Mail color="var(--text)"/>
                        <p className={`
                            text-[20px]
                            max-[430px]:text-[16px]
                            max-[355px]:text-[14px]
                        `}>อีเมล: tumairservice.chon@gmail.com</p>
                    </div>
                    <div className={`
                        max-w-[370px]
                        max-[730px]:mt-[30px]
                    `}>
                        <div className={`
                            flex items-center gap-2 p-[2px_10px] rounded-2xl justify-center hidden
                            max-[730px]:flex
                        `}>
                            <Verify color="#d08700"/>
                            <p className={`
                                text-yellow-600
                                max-[385px]:text-[14px]
                            `}>ผ่านการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ</p>
                        </div>
                        <div className={`
                            mt-[30px] flex gap-3
                            max-[730px]:mt-[10px]
                            max-[430px]:flex-col max-[430px]:items-center
                        `}>
                            <div>
                                <button 
                                    type="button"
                                    className="flex items-center justify-center gap-2 bg-green w-[180px] p-[8px_10px] rounded-[6px] cursor-pointer hover:bg-green/90"
                                >
                                    <Chat color="white"/>
                                    <p className="text-white font-bold">ปรึกษาผ่าน ไลน์</p>
                                </button>
                            </div>
                            <div>
                                <button 
                                    type="button"
                                    className="flex items-center justify-center gap-1 outline-2 outline-text/50 w-[180px] p-[8px_10px] rounded-[6px] cursor-pointer hover:bg-black/5"
                                >
                                    <Phone color="var(--text)"/>
                                    <p className="font-bold">โทรปรึกษา</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`
                    hidden
                    max-[980px]:block max-[980px]:w-[400px]
                    max-[750px]:hidden
                `}>
                </div>
                <img 
                    src="../person.png" alt=""
                    className={`
                        w-[350px] absolute right-[150px] bottom-[-80px] drop-shadow-[20px_20px_25px_rgba(0,0,0,0.5)]
                        max-[1215px]:right-[20px]
                        max-[860px]:right-[0px]
                        max-[750px]:hidden
                    `}
                />
            </div>
            <div className="my-[25px] px-[20px]">
                <ImageSlider images={images} autoPlayDelay={3000}/>
            </div>
            <div className="mt-[50px] mb-[25px] h-[40px]">
                <div className="absolute left-0 w-[calc(100dvw_-_5px)] overflow-hidden">
                    <ImageMarquee images={imagesLogo} speed={150}/>
                </div>
            </div>
            <div id="service" className={`
                relative mt-[50px] mb-[25px] h-[450px] p-[20px] flex flex-col items-center overflow-hidden
                max-[625px]:h-full
            `}>
                <img 
                    src="./wave_background_pattern.svg" alt="" 
                    className="absolute top-0 block w-full h-full object-cover border scale-[1.1] opacity-50 left-0 z-[-1]"
                    style={{
                        maskImage: "linear-gradient(to left, transparent 0%, black 70%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 70%, transparent 100%)"
                    }}
                />
                <p className="text-[25px] font-bold">บริการของเรา</p>
                <div className={`
                    mt-[50px] h-full self-end
                    max-[955px]:self-center
                    max-[625px]:w-full
                `}>
                    <div className={`
                        h-full flex gap-[20px]
                        max-[625px]:flex-col
                    `}>
                        <div className="p-[20px_20px_10px_20px] border-5 border-blue-1/20 rounded-[8px]">
                            <div className="mb-[10px] flex items-center gap-2">
                                <Toolbox color="var(--text)"/>
                                <p className="text-[18px]">ล้างแอร์</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <Toolbox color="var(--text)"/>
                                <p className="text-[18px]">ติดตั้งแอร์ใหม่</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <Toolbox color="var(--text)"/>
                                <p className="text-[18px]">ย้ายแอร์</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <Toolbox color="var(--text)"/>
                                <p className="text-[18px]">เช็ครั่ว เติมน้ำยา</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <Toolbox color="var(--text)"/>
                                <p className="text-[18px]">ตรวจเช็ค วิเคราะห์อาการเสีย</p>
                            </div>
                        </div>

                        <div className="p-[20px_20px_10px_20px] border-5 border-blue-1/20 rounded-[8px]">
                            <div className="mb-[10px] flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 text-[20px] rounded-full text-green flex items-center justify-center text-[12px]">
                                    ✓
                                </span>
                                <p className="text-[18px]">ช่างมีใบประกอบวิชาชีพ</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 text-[20px] rounded-full text-green flex items-center justify-center text-[12px]">
                                    ✓
                                </span>
                                <p className="text-[18px]">เน้นงานถูกต้อง ปลอดภัย</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 text-[20px] rounded-full text-green flex items-center justify-center text-[12px]">
                                    ✓
                                </span>
                                <p className="text-[18px]">ทำงานเรียบร้อย</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 text-[20px] rounded-full text-green flex items-center justify-center text-[12px]">
                                    ✓
                                </span>
                                <p className="text-[18px]">รับประกันงานหลังทำ</p>
                            </div>
                            <div className="mb-[10px] flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 text-[20px] rounded-full text-green flex items-center justify-center text-[12px]">
                                    ✓
                                </span>
                                <p className="text-[18px]">จบงานแล้ว ไม่มีเรียกเก็บเพิ่ม</p>
                            </div>
                        </div>
                    </div>
                    <img 
                        src="../person2.png" alt=""
                        className={`
                            w-[400px] absolute left-[150px] bottom-[-150px] drop-shadow-[20px_20px_25px_rgba(0,0,0,0.5)]
                            max-[1285px]:left-[80px]
                            max-[1160px]:left-[0px]
                            max-[1000px]:w-[350px] max-[1000px]:bottom-[-80px]
                            max-[955px]:hidden
                        `}
                    />
                </div>
            </div>
            <div className="mt-[50px] mb-[25px] p-[20px]">
                <p className="text-[25px] font-bold text-center">พื้นที่ให้บริการ</p>
                <div className="mt-[20px] flex justify-center flex-wrap">
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">เมืองชลบุรี</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">เสม็ด</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">บางแสน</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">ห้วยกะปิ</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">อมตะ</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">ศรีราชา</span>
                    <span className="mr-[10px] mb-[10px] p-[10px_20px] border border-text/20 rounded-[30px] text-blue-2">และใกล้เคียง</span>
                </div>
            </div>
            <div id="workings" className="mt-[25px] mb-[25px] p-[20px]">
                <p className="text-[25px] font-bold text-center">ภาพกิจกรรมการทำงาน</p>
                <div className="mt-[20px]">
                    <ImagesActivity images={activityImages}/>
                </div>
            </div>
            <div className="mt-[25px] mb-[25px] p-[20px]">
                <p className="text-[25px] font-bold text-center">วิดีโอการทำงาน</p>
                <div className="mt-[20px]">
                    <VideoEmbedUrl urls={videoUrl}/>
                </div>
            </div>
            <div className="mt-[25px] mb-[25px] p-[20px]">
                <p className="text-[25px] font-bold text-center">คำนวณ BTU</p>
                <div className={`
                    mt-[20px] flex items-center gap-[20px]
                    max-[1005px]:flex-col    
                `}>
                    <table className={`
                        max-[1005px]:w-full
                        max-[550px]:text-[14px]
                    `}>
                        <thead>
                            <tr className="border-b border-text/30">
                                <th className={`
                                    px-[50px] p-[5px] text-blue-1
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px]
                                `}>พื้นที่ห้อง (ตร.ม.)</th>
                                <th className={`
                                    px-[50px] p-[5px] text-blue-1
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px]
                                `}>ขนาดห้องโดยประมาณ</th>
                                <th className={`
                                    px-[50px] p-[5px] text-blue-1
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px]
                                `}>BTU ที่แนะนำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px] 
                                    max-[550px]:px-[5px]
                                `}>8–12</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px] 
                                    max-[550px]:px-[5px]
                                `}>ห้องนอนเล็ก</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px] 
                                    max-[550px]:px-[5px]
                                `}>9,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px] 
                                    max-[550px]:px-[5px]
                                `}>12–16</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px]
                                `}>ห้องนอนกลาง</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px]
                                `}>12,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>16–20</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>ห้องนอนใหญ่</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>15,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>20–24</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>ห้องนั่งเล่นเล็ก</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>18,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>24–30</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>ห้องนั่งเล่นกลาง</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>20,000–24,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>30–40</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>ห้องนั่งเล่นใหญ่</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>25,000–30,000</td>
                            </tr>
                            <tr className="border-b border-text/30">
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>40–50</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>ห้องโถง/ออฟฟิศเล็ก</td>
                                <td className={`
                                    px-[50px] p-[5px] text-center
                                    max-[1190px]:px-[20px]
                                    max-[550px]:px-[5px] 
                                `}>32,000–36,000</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="grow-1 flex justify-center">
                        <Btucal/>
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-center mt-[10px]">
                    <div>
                        <CircleAlert color="red"/>
                    </div>
                    <p className="text-red-500 text-[15px]">หมายเหตุ: ข้อมูลที่ได้จากการคำนวณนี้ใช้สำหรับการประเมินเบื้องต้นเท่านั้น ปัจจัยอื่น ๆ เช่น ความสูงเพดาน, จำนวนคน, และทิศทางแดด อาจทำให้ต้องเพิ่มขนาด BTU ครับ</p>
                </div>
            </div>
            <div id="contact-us" className={`
                mt-[100px]
                max-[655px]:mt-[50px]
            `}>
                <Footer/>
            </div>
        </div>
    );
}