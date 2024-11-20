import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserRoundCog,
} from "lucide-react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
import { logoutUser, resetTokenAndCreadentials } from "@/store/auth-slice";
import UserCartItemsContent from "./cart-items-content";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems({ setIsSheetOpen }) {
  const handleClick = () => {
    if (setIsSheetOpen) setIsSheetOpen(false); // Check if setIsSheetOpen is defined before calling it
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? {
            category: [menuItem.id],
          }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${menuItem.id}`))
      : navigate(menuItem.path);
  };

  useEffect(() => {
    // if (
    //   location.pathname.includes("listing") &&
    //   (searchParams.get("category") !== null ||
    //     searchParams.get("brand") !== null)
    // ) {
    //   const category = searchParams.get("category");
    //   const brand = searchParams.get("brand");
    //   // console.log(category);
    //   const currentFilter = {
    //     category: category && category.split(","),
    //     brand: brand && brand.split(","),
    //   };
    //   sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    //   //  navigate(menuItem.path);
    // }
  }, []);

  return (
    <nav className="mb-6 flex flex-col gap-6 lg:mb-0 lg:flex-row lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => {
            handleClick();
            handleNavigate(menuItem);
          }}
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

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetTokenAndCreadentials());
    sessionStorage.clear();
    navigate("/auth/login");
    // dispatch(logoutUser());
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
          className="relative"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 right-[2px] font-bold">
            {cartItems?.items?.length || 0}{" "}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden lg:block">
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black font-extrabold text-white">
              {user?.userName
                .split(" ")
                // .filter((username) => username) // Filter out any empty strings
                .map((username) => username[0].toUpperCase())
                // .slice(0, 2)
                // Get the first two initials
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(resetTokenAndCreadentials());
    sessionStorage.clear();
    navigate("/auth/login");
    // dispatch(logoutUser());
  };
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link className="flex items-center gap-2" to={"/shop/home"}>
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Ecommerce</span>
          </Link>
          <div className="flex gap-2 lg:hidden">
            <HeaderRightContent />
            <Sheet
              open={isSheetOpen}
              onOpenChange={() => setIsSheetOpen(false)}
            >
              {/* <HeaderRightContent /> */}
              {/* <SheetTrigger asChild> */}

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSheetOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
              {/* </SheetTrigger> */}

              <SheetContent
                className="h-100vh flex w-full max-w-xs flex-col justify-between overflow-auto"
                side="left"
              >
                <MenuItems setIsSheetOpen={setIsSheetOpen} />
                <div className="flex flex-col gap-6">
                  <Label
                    className="flex cursor-pointer text-sm font-medium"
                    onClick={() => {
                      setIsSheetOpen(false);
                      navigate("/shop/account");
                    }}
                  >
                    <UserRoundCog className="mr-2 h-4 w-4" />
                    My Account
                  </Label>
                  <Label
                    className="flex cursor-pointer text-sm font-medium"
                    onClick={() => {
                      setIsSheetOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Label>
                </div>
              </SheetContent>
            </Sheet>
          </div>

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
