import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice.js";
import AddressCard from "./address-card";
import { toast } from "@/hooks/use-toast";

export default function Address({
  setCurrentSelectedAddress,
  currentSelectedAddress,
  isAllowToSelectAddress,
}) {
  const initialData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  let [formData, setFormData] = useState(initialData);
  // console.log(formData);

  function handleManageAddress(e) {
    e.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      toast({
        title: "You can add max 3 addresses.",
        variant: "destructive",
      });
      return;
    }
    if (currentEditedId) {
      dispatch(
        editAddress({
          userId: user.userId,
          addressId: currentEditedId,
          formData,
        }),
      ).then((data) => {
        if (data.payload.success) {
          // console.log(data);
          toast({
            title: "Address updated.",
          });
          dispatch(fetchAllAddresses(user?.userId));
        }
      });
      setCurrentEditedId(null);
    } else {
      formData = { ...formData, userId: user.userId };
      dispatch(addNewAddress(formData)).then((data) => {
        if (data.payload.success) {
          toast({
            title: "Address added.",
          });
          dispatch(fetchAllAddresses(user?.userId));
        }
      });
    }
    setFormData(initialData);
  }

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  };
  useEffect(() => {
    dispatch(fetchAllAddresses(user?.userId));
  }, [dispatch]);

  const handleDeleteAddress = (addressInfo) => {
    dispatch(
      deleteAddress({ userId: user.userId, addressId: addressInfo._id }),
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Address deleted.",
        });
        dispatch(fetchAllAddresses(user.userId));
        if (addressInfo._id === currentEditedId) {
          setFormData(initialData);
          setCurrentEditedId(null);
        }
      }
    });
  };

  function handleEditAddress(editAddress) {
    setCurrentEditedId(editAddress._id);

    setFormData({
      ...formData,
      address: editAddress.address,
      city: editAddress.city,
      phone: editAddress.phone,
      pincode: editAddress.pincode,
      notes: editAddress.notes,
    });
  }
  return (
    <Card>
      <div className="mb-5 grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
        {addressList.length > 0 &&
          addressList.map((address, i) => (
            <AddressCard
              isAllowToSelectAddress={isAllowToSelectAddress}
              addressInfo={address}
              key={i}
              srno={i}
              handleEditAddress={handleEditAddress}
              handleDeleteAddress={handleDeleteAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
              currentSelectedAddress={currentSelectedAddress}
            />
          ))}
      </div>

      <CardHeader>
        <CardTitle>{currentEditedId ? "Edit" : "Add New"} Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId ? "Update" : "Add "}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}
