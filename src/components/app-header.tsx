import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
    return (
        <header className="flex items-center bg-background h-14 px-4 gap-2 border-b shrink-0">
            <SidebarTrigger />
        </header>
    );

};

export default AppHeader;