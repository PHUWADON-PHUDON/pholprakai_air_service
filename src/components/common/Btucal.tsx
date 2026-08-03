"use client";
import { useState, useMemo } from "react";

const sunFactorOptions = [
    { label: "ไม่โดนแดด (ห้องนอนชั้นล่าง มีร่มเงา)", value: 700 },
    { label: "โดนแดดปานกลาง (ห้องทั่วไป)", value: 800 },
    { label: "โดนแดดจัด (ผนังรับแดดโดยตรง)", value: 900 },
    { label: "ห้องครัว/ห้องมีเครื่องใช้ไฟฟ้าความร้อนสูง", value: 1000 },
];

export default function Btucal() {
    const [width, setWidth] = useState("0");
    const [length, setLength] = useState("0");
    const [sunFactor, setSunFactor] = useState(800);

    const area = Number(width) * Number(length);
    const btu = useMemo(() => Math.round((area * sunFactor) / 500) * 500, [area, sunFactor]);

    return (
        <div className="max-w-md p-6 rounded-[12px] bg-white/5">
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                    <label className="text-[13px] block mb-1.5">กว้าง (เมตร)</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        min={0}
                        className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-[13px] block mb-1.5">ยาว (เมตร)</label>
                    <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        min={0}
                        className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                    />
                </div>
            </div>

            <div className="mb-2">
                <label className="text-[13px] block mb-1.5">ลักษณะห้อง</label>
                <select
                    value={sunFactor}
                    onChange={(e) => setSunFactor(Number(e.target.value))}
                    className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none"
                >
                    {sunFactorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white/5 rounded-[8px] p-4 flex justify-between items-baseline mb-2">
                <span className="text-[13px]">พื้นที่ห้อง</span>
                <span className="text-[15px] font-medium">{area.toFixed(1)} ตร.ม.</span>
            </div>

            <div className="bg-blue-2 rounded-[8px] p-2 flex justify-between items-baseline">
                <span className="text-[13px] text-white">BTU ที่แนะนำ</span>
                <span className="text-[24px] font-medium text-white">
                    {btu.toLocaleString()} BTU
                </span>
            </div>
        </div>
    );
}