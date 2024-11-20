import React from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

export default function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  // console.log(user);

  return (
    <DialogContent className="h-[80vh] overflow-auto lg:max-h-[80vh]">
      <DialogTitle></DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Order Id </p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Order Date </p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Order Price </p>
            <Label>$ {orderDetails?.totalAmount}</Label>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Payment Method </p>
            <Label> {orderDetails?.paymentMethod}</Label>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Payment Status </p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">Order Status </p>
            <Label>
              <Badge
                className={`p-2 px-3 py-1 ${orderDetails?.orderStatus === "Confirmed" ? "bg-green-500 hover:bg-green-400" : "bg-black"} `}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map((item, i) => (
                  <li className="flex items-center justify-between" key={i}>
                    <span> {item.title} </span>
                    <span>Quantity : {item.quantity} </span>
                    <span>Price : ${item.price} </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo.address}</span>
              <span>{orderDetails?.addressInfo.city}</span>
              <span>{orderDetails?.addressInfo.pincode}</span>
              <span>{orderDetails?.addressInfo.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
