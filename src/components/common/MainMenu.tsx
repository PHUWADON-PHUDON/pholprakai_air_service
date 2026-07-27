import { MenuList } from "@/lib/utils/MenuList";

export default function MainMenu() {
    return(
        <div>
            <div className="flex gap-3.5">
                {MenuList.map((item, i) => (
                    <a key={i} href={item.path} className="font-bold">
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
}