import Address from "@/components/shopping-view/address";
import checkoutImg from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createNewOrder } from "@/store/shop/order-slice";

function ShoppingCheckout() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  useEffect(() => {
    if (addressList?.length && addressList?.length === 1) {
      setCurrentSelectedAddress(addressList[0]);
    }
  }, [addressList]);

  const dispatch = useDispatch();
  const total = cartItems?.items
    ?.map((item) => {
      return (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity;
    })
    .reduce((a, c) => a + c, 0);

  const handleInitiatePaypalPayment = () => {
    if (!cartItems?.items?.length) {
      toast({
        title: "Cart is empty.",
        variant: "destructive",
      });
      return;
    }
    if (!addressList.length) {
      toast({
        title: "Please add address to checkout.",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select any one address.",
        variant: "destructive",
      });
      return;
    }
    const orderData = {
      userId: user?.userId,
      cartId: cartItems._id,
      cartItems: cartItems?.items?.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: total,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    // console.log(orderData);
    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        // console.log(data);

        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  };
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={checkoutImg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
        <Address
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          currentSelectedAddress={currentSelectedAddress}
          isAllowToSelectAddress="true"
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((item, i) => (
              <UserCartItemsContent cartItem={item} key={i} />
            ))}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">$ {total?.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={handleInitiatePaypalPayment}>
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
