import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

export default function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const total = cartItems?.items
    ?.map((item) => {
      return (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity;
    })
    .reduce((a, c) => a + c, 0);

  return (
    <SheetContent className="overflow-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {cartItems?.items?.length > 0 ? (
        <>
          <div className="mt-8 space-y-4">
            {cartItems.items &&
              cartItems.items.length > 0 &&
              cartItems.items.map((item, i) => (
                <UserCartItemsContent cartItem={item} key={i} />
              ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">$ {total?.toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
          >
            Checkout
          </Button>
        </>
      ) : (
        <h3 className="mt-7 text-center font-semibold">Cart is empty.</h3>
      )}
    </SheetContent>
  );
}
