import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

export default function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList } = useSelector((state) => state.shopOrder);
  const [orderDetails, setOrderDetails] = useState(null);
  // console.log(orderDetails);

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetails(orderId)).then((data) => {
      setOrderDetails(data.payload.data);
      setOpenDetailsDialog(true);
    });
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.userId));
  }, []);
  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
    setOrderDetails(null);
  };
  // useEffect(() => {
  //   if (orderDetails) {
  //     setOpenDetailsDialog(true);
  //   }
  // }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.length > 0 &&
              orderList.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <div
                      className={`max-w-max rounded-2xl p-2 px-3 py-1 text-white ${
                        order.orderStatus === "Confirmed"
                          ? "bg-green-500"
                          : order?.orderStatus === "Rejected"
                            ? "bg-red-500"
                            : "bg-black"
                      } `}
                    >
                      {order.orderStatus}
                    </div>
                  </TableCell>
                  <TableCell>$ {order?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={handleCloseDialog}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(order._id)}
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
