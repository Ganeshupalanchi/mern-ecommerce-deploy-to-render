import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetail } from "@/store/shop/product-slice";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { addNewReview, getReviews } from "@/store/shop/review-slice";

export default function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const dispatch = useDispatch();

  const totalReviewsLength = reviews.length;
  const averageReview =
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength || 0;

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

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
        console.log(data.payload);

        setRating(0);
        setReviewMsg("");
      },
    );
  };
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetail());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addNewReview({
        productId: productDetails?._id,
        userId: user?.userId,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    ).then((data) => {
      console.log(data);

      if (data.payload.success) {
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review addedd.",
        });
      } else {
        if (data?.payload.message) {
          toast({
            title: data.payload.message,
            variant: "destructive",
          });
        }
      }
      // handleDialogClose();
      setRating(0);
      setReviewMsg("");
    });
  }

  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails]);

  const StarRating = ({ rating, classname = "text-xl" }) => {
    const stars = Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className={classname}>
          {index < rating ? "★" : "☆"}
        </span>
      ));
    return <div>{stars}</div>;
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="flex h-[90vh] max-w-[90vw] grid-cols-2 flex-col gap-8 sm:grid sm:max-w-[80vw] sm:p-12 lg:max-w-[70vw]">
        <div className="h-50% relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            // height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="h-full w-full overflow-auto sm:h-auto">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="mb-5 mt-4 text-xl text-muted-foreground">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 && "line-through"}`}
            >
              $ {productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className={`text-3xl font-bold text-muted-foreground`}>
                $ {productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <StarRating
                rating={Math.round(averageReview)}
                classname={"text-2xl"}
              />
            </div>
            <span className="text-muted-foreground">
              ({averageReview?.toFixed(1)})
            </span>
          </div>
          <div className="mb-5 mt-5">
            {productDetails?.totalStock <= 0 ? (
              <Button className="w-full cursor-not-allowed opacity-60">
                Out Of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={productDetails?.totalStock <= 0}
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock,
                  )
                }
              >
                Add To Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="mt-1 overflow-auto">
            <h2 className="mb-4 text-xl font-bold">Reviews</h2>
            <div className="grid max-h-[200px] gap-6 overflow-auto">
              {reviews.length > 0 ? (
                reviews.map((review, i) => (
                  <div className="flex gap-4" key={i}>
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>
                        {review.userName
                          .split(" ")
                          .filter((name) => name)
                          .map((name) => name[0].toUpperCase())
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-[-1]">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold">{review.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRating
                          rating={Math.round(review.reviewValue)}
                          classname={"text-xl"}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        {review?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No reviews yet.</h1>
              )}
            </div>
            <Separator className="my-1" />
            <div className="mt-2 flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
                className="m-1"
              />
              <Button
                className="m-1"
                disabled={reviewMsg.trim() === ""}
                onClick={handleAddReview}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
