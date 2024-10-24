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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getOrderDetailsForAdmin,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

export default function AdminOrdersView() {
  // console.log("admin Orders");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList } = useSelector((state) => state.adminOrder);
  const [orderDetails, setOrderDetails] = useState();

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetailsForAdmin(orderId)).then(
      (data) => setOrderDetails(data.payload.data),
      setOpenDetailsDialog(true),
    );
  };

  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
    setOrderDetails(null);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
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
                      <AdminOrderDetailsView
                        orderDetails={orderDetails}
                        setOrderDetails={setOrderDetails}
                      />
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
