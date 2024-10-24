import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser, resetTokenAndCreadentials } from "@/store/auth-slice";

export default function AdminHeader({ setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    // const response = dispatch(logoutUser()).then((data) => console.log(data));
    dispatch(resetTokenAndCreadentials());
    sessionStorage.clear();
    navigate("/auth/login");
  };
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <Button onClick={() => setOpen(true)} className="sm:block lg:hidden">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow"
          onClick={() => logout()}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}
