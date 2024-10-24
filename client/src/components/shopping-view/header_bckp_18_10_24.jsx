import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserRoundCog,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";

// import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartItemsContent from "./cart-items-content";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();

  const handleNavigate = (menuItem) => {
    // return;
    if (menuItem === "home") {
      sessionStorage.removeItem("filters");
      navigate("/shop/home");
    } else {
      const currentFilter = {
        category: [menuItem],
      };
      console.log(currentFilter.category[0]);
      if (
        JSON.parse(sessionStorage.getItem("filters"))?.category[0] &&
        JSON.parse(sessionStorage.getItem("filters")).category[0] ===
          currentFilter.category[0]
      ) {
        return;
      }
      sessionStorage.removeItem("filters");

      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      console.log(JSON.parse(sessionStorage.getItem("filters")));
      navigate("/shop/listing");
    }
  };
  return (
    <nav className="mb-3 flex flex-col gap-6 lg:mb-0 lg:flex-row lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem.id)}
          className="cursor-pointer text-sm font-medium"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  // console.log(cartItems);

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  useEffect(() => {
    dispatch(fetchCartItems(user?.userId));
  }, [dispatch]);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <div className="rounded-full bg-black p-2">
            <div className="bg-black font-extrabold text-white">
              {user?.userName
                .split(" ")
                .map((username) => username[0].toUpperCase())
                .join("")}
            </div>
          </div> */}
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black font-extrabold text-white">
              {user?.userName
                .split(" ")
                .map((username) => username[0].toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel> {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
          >
            <UserRoundCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link className="flex items-center gap-2" to={"/shop/home"}>
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Ecommerce</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full max-w-xs" side="left">
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <MenuItems />
          </div>
          {isAuthenticated && (
            <div className="hidden lg:block">
              <HeaderRightContent />
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default ShoppingHeader;
