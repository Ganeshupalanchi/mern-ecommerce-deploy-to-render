import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);
  console.log(location.search);
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (token && payerId) {
      dispatch(capturePayment({ token, payerId })).then((data) => {
        if (data.payload.success) {
          console.log(data);
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [dispatch, token, payerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
