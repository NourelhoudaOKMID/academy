import { Link, router } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';
import { TransText } from '@/components/TransText';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator } from
'@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

export function UserMenuContent({ user }) {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
            className="block w-full cursor-pointer"
            href={edit()}
            prefetch
            onClick={cleanup}>
            
                        <User className="mr-2" />
                        <TransText en="Profile" fr="Profile" ar="Profile" />
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                asChild
                className="text-error focus:bg-error/10 focus:text-error"
            >
                <Link
          className="flex w-full cursor-pointer items-center text-error"
          href={logout()}
          as="button"
          onClick={handleLogout}
          data-test="logout-button">
          
                    <LogOut className="mr-2 text-error" />
                    <TransText en="Log out" fr="Log out" ar="Log out" />
                </Link>
            </DropdownMenuItem>
        </>);

}
