import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, Coins } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

const geekPoints = '1,240';
const profileStats = {
    level: 3,
    progress: 72,
};
const fallbackUser = {
    name: 'Local Coach',
    email: 'local-coach@example.test',
    avatar: '',
};

export function NavbarUser() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const user = auth.user ?? fallbackUser;

    return (
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-12 gap-2 rounded-full px-2.5"
                        aria-label="Open user menu"
                    >
                        <Avatar className="size-8 overflow-hidden rounded-full">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                            />
                            <AvatarFallback className="rounded-full bg-neutral-200 text-xs text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(user.name ?? '')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden min-w-36 max-w-44 flex-col items-start gap-1 md:flex">
                            <span className="max-w-full truncate text-sm font-medium leading-none">
                                {user.name}
                            </span>
                            <span className="flex w-full items-center gap-2 text-[0.68rem] leading-none text-muted-foreground">
                                <span className="font-medium text-alpha">
                                    <TransText en="Level" fr="Level" ar="Level" />{' '}
                                    {profileStats.level}
                                </span>
                                <span className="inline-flex items-center gap-1 text-alpha">
                                    <Coins className="size-3" />
                                    {geekPoints}{' '}
                                    <TransText
                                        en="Geek Points"
                                        fr="Geek Points"
                                        ar="Geek Points"
                                    />
                                </span>
                            </span>
                            <span className="h-1 w-full overflow-hidden rounded-full bg-muted">
                                <span
                                    className="block h-full rounded-full bg-alpha"
                                    style={{ width: `${profileStats.progress}%` }}
                                />
                            </span>
                        </span>
                        <ChevronsUpDown className="size-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <UserMenuContent user={user} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
