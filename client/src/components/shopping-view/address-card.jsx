import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function AddressCard({
  addressInfo,
  srno,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  currentSelectedAddress,
}) {
  return (
    <Card
      className={`cursor-pointer ${
        currentSelectedAddress?._id === addressInfo?._id
          ? "border-[2px] border-black"
          : ""
      }`}
      onClick={() => setCurrentSelectedAddress(addressInfo)}
    >
      <CardContent className="grid gap-4 p-4">
        <div className="flex justify-between">
          <h3>Address {srno + 1}</h3>
          {currentSelectedAddress?._id === addressInfo._id ? (
            <Badge>Selected</Badge>
          ) : (
            ""
          )}
        </div>
        <Label>Address : {addressInfo?.address}</Label>
        <Label>City : {addressInfo?.city}</Label>
        <Label>Pincode : {addressInfo?.pincode}</Label>
        <Label>Phone : {addressInfo?.phone}</Label>
        <Label>Notes : {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
