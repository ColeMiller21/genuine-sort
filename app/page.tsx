import { ConnectBtn } from "@/components/connect-btn";
import { DisplayOwned } from "@/components/display-owned";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-8 items-center p-24 max-w-[1400px]">
      <div className="flex gap-3 items-center">
        <ConnectBtn />
        <ThemeToggle />
      </div>
      <DisplayOwned />
    </main>
  );
}
