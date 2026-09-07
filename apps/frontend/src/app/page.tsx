import { SCREENS } from "@/lib/Constants";
import { redirect } from "next/navigation";

export default function Home() {
    return redirect(SCREENS.VENUES);
}
