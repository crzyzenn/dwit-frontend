// Exercise
// JOIN ... in mongodb...
// aggregation -- mongod -> $lookup..
// API
// jwt...access, refresh tokens, login, logout, register...

// {
//     "items": [
//       {
//         "name": "Product 1",
//         "price": 99,
//         "quantity": 4,
//         "image": "asdfadf",
//         "basePrice": 9
//       },
//       {
//         "name": "Product 2",
//         "price": 999,
//         "quantity": 10,
//         "image": "xxxx",
//         "basePrice": 100
//       }
//     ],
//     "orderedAt": "2021-06-29T02:07:35.820Z",
//     "_id": "60da807d457f067e6c4942b6",
//     "checkoutInfo": {
//       "address": "my address",
//       "contact": 9803001222
//     },
//     "paymentType": 1,
//     "totalPrice": 999,
//     "user": {
//       "email": "jerry@gmail.com",
//       "id": "60c6c191c094777043389e78",
//       "name": "Jerry Man"
//     },
//     "__v": 0
//   },

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { EditOutlined } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { SnackbarContext } from "../contexts/Snackbar";
import { $axios } from "../lib/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await $axios.get("/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Orders</h1>
      </div>

      {loading ? (
        <LinearProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>Checkout Info</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Ordered by</TableCell>
                <TableCell>Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                    }}
                  >
                    <div>
                      {order.items.map((order, index) => (
                        <div key={index}>
                          <img src={order.image} width="100px" />
                          <p>{order.name}</p>
                          <h1>
                            {order.price} | {order.quantity}
                          </h1>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.checkoutInfo.address} | {order.checkoutInfo.contact}
                  </TableCell>
                  <TableCell>
                    {order.paymentType === 1 ? "Card" : "Cash on Delivery"}
                  </TableCell>
                  <TableCell>
                    {order.user.name}, {order.user.email} at{" "}
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
