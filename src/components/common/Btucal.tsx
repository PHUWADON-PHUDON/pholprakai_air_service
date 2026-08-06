"use client";
import { useMemo, useState } from "react"; 

const coolingLoadOptions = [
    {
        label: "ห้องไม่โดนแดด",
        value: 850,
    },
    {
        label: "ห้องโดนแดดน้อย",
        value: 950,
    },
    {
        label: "ห้องโดนแดดมาก",
        value: 1050,
    },
];

export default function Btucal() {
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [height, setHeight] = useState("");

    const [coolingLoad, setCoolingLoad] =
        useState(800);

    const area = Number(width) * Number(length);

    const btu = useMemo(() => {
        const w = Number(width);
        const l = Number(length);
        const h = Number(height);

        if (
            !w ||
            !l ||
            !h ||
            w <= 0 ||
            l <= 0 ||
            h <= 0
        ) {
            return 0;
        }

        const result = ((w * l) * (h/3)) * coolingLoad

        return Math.round(result / 500) * 500;
    }, [width, length, height, coolingLoad]);

    return (
        <div className="max-w-md p-6 rounded-[12px] bg-white/5">
            <p className="text-[13px] mb-[20px]">คำนวณให้ละเอียดขึ้นด้วยการกำหนด ความกว้าง ความยาว และ ความสูงจากพื้นถึงเพดานเอง</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                    <label className="text-[13px] block mb-1.5">
                        กว้าง (เมตร)
                    </label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) =>
                            setWidth(e.target.value)
                        }
                        min={0}
                        step="0.1"
                        className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-[13px] block mb-1.5">
                        ยาว (เมตร)
                    </label>

                    <input
                        type="number"
                        value={length}
                        onChange={(e) =>
                            setLength(e.target.value)
                        }
                        min={0}
                        step="0.1"
                        className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-[13px] block mb-1.5">
                        สูง (เมตร)
                    </label>

                    <input
                        type="number"
                        value={height}
                        onChange={(e) =>
                            setHeight(e.target.value)
                        }
                        min={0}
                        step="0.1"
                        className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                    />
                </div>
            </div>

            {/* Cooling Load */}
            <div className="mb-5">
                <label className="text-[13px] block mb-1.5">
                    ลักษณะห้อง
                </label>

                <select
                    value={coolingLoad}
                    onChange={(e) =>
                        setCoolingLoad(
                            Number(e.target.value)
                        )
                    }
                    className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                >
                    {coolingLoadOptions.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-white/5 rounded-[8px] p-4 flex justify-between items-baseline mb-2">
                <span className="text-[13px]">
                    พื้นที่ห้อง
                </span>

                <span className="text-[15px] font-medium">
                    {area.toFixed(1)} ตร.ม.
                </span>
            </div>
            <div className="bg-blue-2 rounded-[8px] p-2 flex justify-between items-baseline">
                <span className="text-[13px] text-white">
                    BTU ที่แนะนำ
                </span>

                <span className="text-[24px] font-medium text-white">
                    {btu.toLocaleString()} BTU
                </span>
            </div>
        </div>
    );
}