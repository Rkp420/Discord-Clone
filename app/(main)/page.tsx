
import { ModeToggle } from "@/components/mode-toggle-button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen">
      <UserButton />
      <ModeToggle />
    </div>
  );
}