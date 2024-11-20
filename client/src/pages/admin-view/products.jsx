import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminProductTile from "./product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};
export default function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const productList = useSelector((state) => state.adminProducts.productList);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const onSubmit = (e) => {
    e.preventDefault();

    if (currentEditedId) {
      // console.log("edit");
      dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false);
        setFormData(initialFormData);
        setCurrentEditedId(null);
        toast({
          title: "Product updated successfully.",
        });
      });
    } else {
      // console.log("Add");
      formData.image = uploadedImageUrl;
      dispatch(addNewProduct(formData)).then((data) => {
        // console.log(data);
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully.",
          });
        }
      });
    }
  };

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }
  const handleDelete = (deleteId) => {
    dispatch(deleteProduct(deleteId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product Deleted.",
          variant: "destructive",
        });
      }
    });
  };
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <>
      <Fragment>
        <div className="mb-5 flex w-full justify-end">
          <Button onClick={() => setOpenCreateProductDialog(true)}>
            {" "}
            Add New Product
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productList && productList.length
            ? productList.map((productItem, i) => (
                <AdminProductTile
                  product={productItem}
                  key={i}
                  setCurrentEditedId={setCurrentEditedId}
                  setOpenCreateProductDialog={setOpenCreateProductDialog}
                  setFormData={setFormData}
                  handleDelete={handleDelete}
                />
              ))
            : ""}
        </div>

        <Sheet
          open={openCreateProductDialog}
          onOpenChange={() => {
            setOpenCreateProductDialog(false);
            setTimeout(() => {
              setFormData(initialFormData);
              setCurrentEditedId(null);
            }, 500);
          }}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>
                {currentEditedId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <ProductImageUpload
                file={imageFile}
                setFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
                editIdImage={formData?.image || null}
              />
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isBtnDisabled={!isFormValid()}
                buttonText={currentEditedId ? "UPDATE" : "ADD"}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
    </>
  );
}
