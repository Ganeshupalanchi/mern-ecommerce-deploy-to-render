import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile.";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { getSeatchResult, resetSearchResults } from "@/store/shop/search-slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function SearchProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  //   const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [keyword, setKeyword] = useState("");

  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productDetails } = useSelector((state) => state.shopProducts);
  //   console.log(searchResults);

  const handleAddToCart = (productId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length > 0) {
      const CurrentItem = getCartItems.find(
        (item) => item.productId === productId,
      );
      if (CurrentItem) {
        const getQuantity = CurrentItem.quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(addToCart({ userId: user?.userId, productId, quantity: 1 })).then(
      (data) => {
        if (data.payload.success) {
          dispatch(fetchCartItems(user?.userId));
          toast({
            title: "Product is added to cart.",
          });
        }
      },
    );
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
    setOpenDetailsDialog(true);
  };

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSeatchResult(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  // useEffect(() => {
  //   if (productDetails) {
  //     setOpenDetailsDialog(true);
  //   }
  // }, [productDetails]);
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex justify-center">
        <div className="flex w-full items-center">
          <Input
            className="py-6"
            placeholder="Search Products..."
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((item) => (
            <ShoppingProductTile
              product={item}
              key={item._id}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <h1 className="text-5xl font-extrabold">No Product Found.</h1>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
