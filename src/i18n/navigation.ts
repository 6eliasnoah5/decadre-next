import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Sprachbewusste Navigation (Link, getPathname, redirect ...).
export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
