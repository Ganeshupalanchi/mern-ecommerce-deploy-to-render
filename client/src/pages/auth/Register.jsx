import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
  // country: "",
  // about: "",
};

export default function Register() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        {
          withCredentials: true,
        },
      );
      // console.log(res);
      if (res.data) {
        setFormData(initialState);
        toast({
          title: res.data.message,
        });
        navigate("/auth/login");
      }
    } catch (error) {
      // console.log(error);
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>

        <p className="mt-2">
          Already have an account ?
          <Link
            to="/auth/login"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
