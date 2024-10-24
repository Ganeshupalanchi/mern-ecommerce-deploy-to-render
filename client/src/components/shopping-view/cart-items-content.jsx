import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQty } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { fetchProductDetails } from "@/store/shop/product-slice";

export default function UserCartItemsContent({ cartItem }) {
  // console.log(cartItem);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  // console.log(productList);

  const dispatch = useDispatch();

  function handleCartItemDelete(cartItem) {
    dispatch(
      deleteCartItem({ userId: user?.userId, productId: cartItem?.productId }),
    );
  }
  function handleUpdateQty(cartItem, typeOfAction) {
    const productDetails = dispatch(fetchProductDetails(cartItem?.productId));
    // console.log(productDetails);

    // return;

    if (typeOfAction === "minus") {
      dispatch(
        updateCartQty({
          userId: user.userId,
          productId: cartItem?.productId,
          quantity: cartItem?.quantity - 1,
        }),
      );
    } else {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length > 0) {
        const CurrentItem = getCartItems.find(
          (item) => item.productId === cartItem?.productId,
        );
        if (CurrentItem) {
          const getQuantity = CurrentItem.quantity;

          const getTotalStock = productDetails?.totalStock;

          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getTotalStock} quantity can be added for this item.`,
              variant: "destructive",
            });
            return;
          }
        }
      }

      dispatch(
        updateCartQty({
          userId: user.userId,
          productId: cartItem?.productId,
          quantity: cartItem?.quantity + 1,
        }),
      );
    }
  }
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="h-20 w-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="mt-1 flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size={"icon"}
            onClick={() => handleUpdateQty(cartItem, "minus")}
            disabled={cartItem.quantity === 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size={"icon"}
            onClick={() => handleUpdateQty(cartItem, "plus")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
            cartItem.quantity
          ).toFixed(2)}
        </p>
        <Trash2
          className="mt-1 cursor-pointer"
          onClick={() => handleCartItemDelete(cartItem)}
          size={20}
        />
      </div>
    </div>
  );
}
