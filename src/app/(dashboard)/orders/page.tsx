"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Stack,
  Typography,
  Box,
  Paper,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Order } from "@/models/Order"; // Asegúrate de que la ruta sea correcta
import { Product } from "@/components/dashboard/products/ProductsPage";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const OrdersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    products: [] as { id: string; product: string; quantity: number }[],
    date: "",
    status: "completed",
    isPaid: true,
  });
  const [checkOuk, setCheckOuk] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchClientSecret = useCallback(async () => {
    console.log("Fetching client secret");
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: newOrder.products,
        }),
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  }, [newOrder]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchOrders();
    fetchProducts();

    const fetchOrdersStripe = async () => {
      try {
        const response = await fetch(`/api/checkout_sessions/${sessionId}`);
        fetchOrders();
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (sessionId) {
      fetchOrdersStripe();
    }
  }, []);

  const handleProductChange = (
    id: string,
    productId: string,
    checked: boolean
  ) => {
    if (checked) {
      setNewOrder({
        ...newOrder,
        products: [
          ...newOrder.products,
          { id: id, product: productId, quantity: 1 },
        ],
      });
    } else {
      setNewOrder({
        ...newOrder,
        products: newOrder.products.filter((p) => p.product !== productId),
      });
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setNewOrder({
      ...newOrder,
      products: newOrder.products.map((p) =>
        p.product === productId ? { ...p, quantity } : p
      ),
    });
  };

  useEffect(() => {
    setCheckOuk(false);
  }, [newOrder]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: "#c3cfe2",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper sx={{ padding: 4, borderRadius: 2, width: "90%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h1" color="primary">
            Orders
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create New Order
          </Button>
        </Stack>
        <Stack direction="column" gap={2}>
          {orders.length > 0 ? (
            orders.map((order, i) => (
              <Card key={i}>
                <CardContent>
                  <Typography variant="h6">
                    Order ID: {order._id as string}
                  </Typography>
                  <Typography variant="body1">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body1">
                    Paid: {order.isPaid ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body1">
                    Products: {order.products.length}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No orders found</Typography>
          )}
        </Stack>
      </Paper>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            height: 600,
            overflow: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
            Create New Order
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                Products
              </Typography>
              {products.map((product) => (
                <Box
                  key={product.stripePriceId}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newOrder.products.some(
                          (p) => p.product === product.stripePriceId
                        )}
                        onChange={(e) =>
                          handleProductChange(
                            product._id,
                            product.stripePriceId,
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={product.name}
                  />
                  {newOrder.products.some(
                    (p) => p.product === product.stripePriceId
                  ) && (
                    <TextField
                      type="number"
                      label="Quantity"
                      value={
                        newOrder.products.find(
                          (p) => p.product === product.stripePriceId
                        )?.quantity || 1
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          product.stripePriceId,
                          parseInt(e.target.value, 10)
                        )
                      }
                      sx={{ width: 100, ml: 2 }}
                    />
                  )}
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {!checkOuk ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (!checkOuk) setCheckOuk(true);
                    else {
                      setCheckOuk(false);
                    }
                    setCheckOuk(true);
                  }}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Generar Orden
                </Button>
              ) : (
                <div id="checkout">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{
                      fetchClientSecret,
                    }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              )}
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrdersPage;
