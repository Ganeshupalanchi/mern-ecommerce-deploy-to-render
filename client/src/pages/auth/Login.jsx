import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { toast, useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

export default function Login({ isLoading }) {
  const [formData, setFormData] = useState(initialState);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .then((data) => {
        // console.log(data);

        if (data?.payload?.success) {
          toast({
            title: data.payload.message,
          });
        } else {
          // console.log(data);
          // console.log(data.payload);
          if (data?.payload?.message) {
            toast({
              title: data.payload.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Something went wrong , try again later.",
              variant: "destructive",
            });
          }
        }
      })
      .catch((error) => {
        toast({
          title: "Server error , try again later.",
          variant: "destructive",
        });
      });

    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/auth/login",
    //     formData,
    //     {
    //       withCredentials: true,
    //     },
    //   );
    //   if (response.data) {
    //     console.log(response.data);
    //     setUserAuth({
    //       isLoading: false,
    //       isAuthenticated: true,
    //       user: response.data.user,
    //     });
    //   }
    // } catch (error) {
    //   if (error.response?.data) {
    //     toast({
    //       variant: "destructive",
    //       title: error?.response?.data?.message,
    //     });
    //   } else {
    //     toast({
    //       variant: "destructive",
    //       title: "Server error! Try again later",
    //     });
    //   }
    //   // console.log(error);
    // }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>

        <p className="mt-2">
          Don't have an account ?
          <Link
            to="/auth/register"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={isLoading ? "Loading..." : "Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isLoading}
      />
    </div>
  );
}
