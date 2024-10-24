import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { GrUserFemale } from "react-icons/gr";
import { GiRunningShoe } from "react-icons/gi";
import { SiNike, SiPuma, SiAdidas, SiZara, SiHandm } from "react-icons/si";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile.";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImage } from "@/store/common-slice";
import { AuthContext } from "@/context/AuthContext";
// import {}

function ShoppinHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  // const { initialState } = useContext(AuthContext);
  // console.log(initialState);

  const handleNavigateToListingPage = (cartItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [cartItem.value],
    };
    // console.log(currentFilter);
    // return;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  };

  const handleAddToCart = (productId) => {
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

  const categoriesWithIcon = [
    { label: "Men", value: "men", icon: ShirtIcon },
    { label: "Women", value: "women", icon: GrUserFemale },
    { label: "Kids", value: "kids", icon: BabyIcon },
    { label: "Accessories", value: "accessories", icon: WatchIcon },
    { label: "Footwear", value: "footwear", icon: GiRunningShoe },
  ];
  const brandsWithIcon = [
    { label: "Nike", value: "nike", icon: SiNike },
    { label: "Adidas", value: "adidas", icon: SiAdidas },
    { label: "Puma", value: "puma", icon: SiPuma },
    { label: "Levi's", value: "levis", icon: Airplay },
    { label: "Zara", value: "zara", icon: SiZara },
    { label: "H&M", value: "hm", icon: SiHandm },
  ];
  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % featureImageList?.length,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price=lowtohigh",
      }),
    );
  }, [dispatch]);
  const handleGetProductDetails = (productId) => {
    // console.log(productId);
    dispatch(fetchProductDetails(productId));
    setOpenDetailsDialog(true);
  };
  useEffect(() => {
    // if (productDetails) {
    //   setOpenDetailsDialog(true);
    // }
  }, [productDetails]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative h-[600px] w-full overflow-hidden">
        {featureImageList.length > 0 &&
          featureImageList.map((slide, i) => (
            <img
              src={slide.image}
              key={i}
              className={`${i === currentSlide ? "opacity-100" : "opacity-0"} absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000`}
            />
          ))}

        <Button
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + featureImageList?.length) %
                featureImageList?.length,
            )
          }
          variant="outline"
          size="icon"
          className={`absolute left-4 top-1/2 -translate-y-1/2 transform bg-white/80`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList?.length)
          }
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 transform bg-white/80"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <section className="bg-gray-50 p-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categoriesWithIcon.map((item, i) => (
              <Card
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                key={i}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="mb-4 h-12 w-12 text-primary" />
                  <CardTitle className="text-xl">{item.label}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Shop by Brand</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {brandsWithIcon.map((item, i) => (
              <Card
                onClick={() => handleNavigateToListingPage(item, "brand")}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                key={i}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="mb-4 h-12 w-12 text-primary" />
                  <CardTitle className="text-xl">{item.label}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="p-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Feature Products
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productList.length > 0 &&
            productList.map((productItem) => (
              <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                key={productItem._id}
                handleAddToCart={handleAddToCart}
              />
            ))}
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppinHome;
