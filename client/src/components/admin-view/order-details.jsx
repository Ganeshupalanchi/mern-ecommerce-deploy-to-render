import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "@radix-ui/react-select";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getAllOrders,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "@/hooks/use-toast";

export default function AdminOrderDetailsView({
  orderDetails,
  setOrderDetails,
}) {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  // console.log(orderDetails?.orderStatus);

  const initialData = {
    status: orderDetails?.orderStatus || "",
  };
  const [formData, setFormData] = useState(initialData);
  // console.log(formData);
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ orderId: orderDetails?._id, orderStatus: status }),
    ).then((data) => {
      if (data.payload.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id)).then((data) =>
          setOrderDetails(data.payload.data),
        );
        dispatch(getAllOrders());
        setFormData(initialData);
        toast({
          title: "Order status updated.",
        });
      }
    });
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/getUserData/${orderDetails?.userId}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; // Re-throw the error if you want to handle it later
    }
  };
  useEffect(() => {
    if (orderDetails?.userId) {
      fetchUserData().then((response) => {
        if (response.success) {
          setUserData(response.data);
        }
      });
    }
  }, [orderDetails]);
  useEffect(() => {
    if (orderDetails && orderDetails?.orderStatus) {
      setFormData({ status: orderDetails?.orderStatus });
    }
  }, [orderDetails]);

  return (
    <DialogContent className="h-[85vh] overflow-auto sm:max-w-[600px]">
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
                className={`p-2 px-3 py-1 ${orderDetails?.orderStatus === "Confirmed" ? "bg-green-500 hover:bg-green-400" : orderDetails?.orderStatus === "Rejected" ? "bg-red-500 hover:bg-red-400" : "bg-black"} `}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <hr />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map((item) => (
                  <li
                    className="flex items-center justify-between"
                    key={item._id}
                  >
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
              <span>{userData?.userName}</span>
              <span>{orderDetails?.addressInfo.address}</span>
              <span>{orderDetails?.addressInfo.city}</span>
              <span>{orderDetails?.addressInfo.pincode}</span>
              <span>{orderDetails?.addressInfo.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            className=""
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                placeholder: "Select",
                options: [
                  { label: "Pending", value: "Pending" },
                  { label: "In Process", value: "In Process" },
                  { label: "InShipping", value: "In Shipping" },
                  { label: "Delivered", value: "Delivered" },
                  { label: "Rejected", value: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          ></CommonForm>
        </div>
      </div>
    </DialogContent>
  );
}
