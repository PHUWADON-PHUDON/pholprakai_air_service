const rows = [
  ["8–12", "ห้องนอนเล็ก", "9,000"],
  ["12–16", "ห้องนอนกลาง", "12,000"],
  ["16–20", "ห้องนอนใหญ่", "15,000"],
  ["20–24", "ห้องนั่งเล่นเล็ก", "18,000"],
  ["24–30", "ห้องนั่งเล่นกลาง", "20,000–24,000"],
  ["30–40", "ห้องนั่งเล่นใหญ่", "25,000–30,000"],
  ["40–50", "ห้องโถง/ออฟฟิศเล็ก", "32,000–36,000"],
];

const cell = "px-[50px] p-[5px] text-center max-[1190px]:px-[20px] max-[550px]:px-[5px]";

export default function BtuTable() {
  return (
    <table className="max-[1005px]:w-full max-[550px]:text-[14px]">
      <thead>
        <tr className="border-b border-text/30">
          {["พื้นที่ห้อง (ตร.ม.)", "ขนาดห้องโดยประมาณ", "BTU ที่แนะนำ"].map((h) => (
            <th key={h} className={`${cell} text-blue-1`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]} className="border-b border-text/30">
            {r.map((c) => <td key={c} className={cell}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
