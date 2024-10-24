import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingViewlayout() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* common header */}
      <ShoppingHeader />
      <main className="mt-16 flex w-full flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingViewlayout;
