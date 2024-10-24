import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";

export default function AdminProductTile({
  product,
  setCurrentEditedId,
  setFormData,
  setOpenCreateProductDialog,
  handleDelete,
}) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <div>
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="h-[300px] w-full rounded-t-lg object-cover"
          />
        </div>

        <CardContent>
          <h2 className="mb-2 text-xl font-bold">{product?.title}</h2>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${product.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product.salePrice > 0 && (
              <span className={`text-lg font-bold`}>${product?.salePrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            onClick={() => {
              setOpenCreateProductDialog(true);
              setCurrentEditedId(product._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
