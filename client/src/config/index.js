export const registerFormControls = [
  {
    componentType: "input", // define field  like : input , select
    type: "text", // if input field , define input type
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
  },
  {
    componentType: "input",
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    componentType: "input",
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
  // {
  //   name: "country",
  //   // label: "Select your country",
  //   placeholder: "Select your country",
  //   componentType: "select",
  //   type: "select",
  //   options: [
  //     { name: "Iceland", code: "IS" },
  //     { name: "India", code: "IN" },
  //     { name: "Indonesia", code: "ID" },
  //     { name: "Iran, Islamic Republic Of", code: "IR" },
  //     { name: "Iraq", code: "IQ" },
  //     { name: "Ireland", code: "IE" },
  //   ],
  // },
  // {
  //   name: "about",
  //   label: "Write something about you",
  //   placeholder: "Write something about you",
  //   componentType: "textarea",
  //   type: "textarea",
  // },
];

export const loginFormControls = [
  {
    componentType: "input",
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    componentType: "input",
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
];

export const addProductFormElements = [
  // {
  //   label: "Image",
  //   name: "image",
  //   componentType: "input",
  //   type: "file",
  //   placeholder: "Upload product image",
  // },
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    placeholder: "Select Category",
    options: [
      { label: "Men", value: "men" },
      { label: "Women", value: "women" },
      { label: "Kids", value: "kids" },
      { label: "Accessories", value: "accessories" },
      { label: "Footwear", value: "footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { label: "Nike", value: "nike" },
      { label: "Adidas", value: "adidas" },
      { label: "Puma", value: "puma" },
      { label: "Under Armour", value: "under-armour" },
      { label: "Levi's", value: "levis" },
      { label: "Zara", value: "zara" },
      { label: "Gucci", value: "gucci" },
      { label: "H&M", value: "hm" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (if applicable)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter available stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOprionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};
export const brandOprionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levis: "Levi's",
  zara: "Zara",
  hm: "H&M",
};
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { label: "Nike", id: "nike" },
    { label: "Adidas", id: "adidas" },
    { label: "Puma", id: "puma" },
    // { label: "Under Armour", id: "under-armour" },
    { label: "Levi's", id: "levis" },
    { label: "Zara", id: "zara" },
    // { label: "Gucci", id: "gucci" },
    { label: "H&M", id: "hm" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price : Low to high" },
  { id: "price-hightolow", label: "Price : High to low" },
  { id: "title-atoz", label: "Title : A to Z" },
  { id: "title-ztoa", label: "Title : Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter any additional notes",
  },
];
