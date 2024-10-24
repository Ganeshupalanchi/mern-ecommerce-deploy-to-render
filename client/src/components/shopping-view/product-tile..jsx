import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOprionsMap, categoryOprionsMap } from "@/config";

export default function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  // const handleStopPropagation = (e) => {
  //   e.stopPropagation();
  //   handleAddToCart(product?._id);
  // };
  return (
    <Card className="mx-auto w-full max-w-sm">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-[300px] w-full rounded-t-lg object-cover"
          />

          {product?.totalStock <= 0 ? (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
              Out of stock
            </Badge>
          ) : product?.totalStock <= 10 ? (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
              Only {product?.totalStock} item left.
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : (
            ""
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="mb-2 text-xl font-bold">{product?.title}</h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-base text-muted-foreground">
              {categoryOprionsMap[product?.category]}
            </span>
            <span className="text-base text-muted-foreground">
              {brandOprionsMap[product?.brand]}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
            >
              $ {product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className={`text-lg font-semibold text-primary`}>
                $ {product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock <= 0 ? (
          <Button className="w-full cursor-not-allowed opacity-60">
            Out Of Stock
          </Button>
        ) : (
          <Button
            disabled={product?.totalStock <= 0}
            className="w-full"
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
