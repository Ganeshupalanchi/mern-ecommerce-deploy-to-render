import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQty,
} from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { fetchProductDetails } from "@/store/shop/product-slice";

export default function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );

  const dispatch = useDispatch();

  function handleCartItemDelete(cartItem) {
    dispatch(
      deleteCartItem({ userId: user?.userId, productId: cartItem?.productId }),
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchCartItems(user.userId));
        toast({
          title: `Product removed from cart.`,
          variant: "destructive",
        });
      }
    });
  }
  function handleDecreaseQty(cartItem) {
    dispatch(
      updateCartQty({
        userId: user.userId,
        productId: cartItem?.productId,
        quantity: cartItem?.quantity - 1,
      }),
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchCartItems(user.userId));
      }
    });
  }
  function handleIncreaseQty(cartItem) {
    if (cartItem.quantity + 1 > cartItem.totalStock) {
      toast({
        title: `You have added max quantity for this item.`,
        variant: "destructive",
      });
      return;
    }
    // console.log("Plus");
    // return;
    dispatch(
      updateCartQty({
        userId: user.userId,
        productId: cartItem?.productId,
        quantity: cartItem?.quantity + 1,
      }),
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchCartItems(user.userId));
      }
    });
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
            onClick={() => handleDecreaseQty(cartItem)}
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
            onClick={() => handleIncreaseQty(cartItem)}
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
