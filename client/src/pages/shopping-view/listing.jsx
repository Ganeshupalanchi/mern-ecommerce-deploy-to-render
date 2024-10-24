import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile.";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";

function ShoppinListing() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const [allProductList, setProductList] = useState(productList);
  const [filters, setFilters] = useState({});
  // console.log(filters);

  const [sort, setSort] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorysearchParams = searchParams.get("category");

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
    setOpenDetailsDialog(true);
  };

  const createSearchParamsHelper = (filterParams) => {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramsValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`);
      }
    }
    // console.log(queryParams);
    return queryParams.join("&");
  };
  const handleSort = (value) => {
    // console.log(value);
    setSort(value);
  };
  const handleFilter = (getSectionId, getCurrentOptions) => {
    let cpyFilters = { ...filters };
    // console.log(filters);
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOptions] };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOptions);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOptions);
      } else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
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
      },
    );
  };

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorysearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      // console.log(createQueryString);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (Object.keys(filters).length || Object.keys(sort).length) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }),
      ).then((data) => {
        if (data?.payload.success) {
          setProductList(data.payload.data);
        }
      });
    }
  }, [dispatch, sort, filters]);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-[200px_1fr] md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="w-full rounded-lg bg-background shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold"> All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {allProductList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
          {allProductList.length &&
            allProductList.map((productItem) => (
              <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                key={productItem._id}
                handleAddToCart={handleAddToCart}
              />
            ))}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppinListing;
