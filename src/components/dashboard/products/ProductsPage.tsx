"use client";
import CreateProductModal from "@/components/dashboard/products/createProductModal";
import { Stack, Typography, Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

import SkeletonLoadingProducts from "@/components/dashboard/products/SkeletonLoadingProducts";
import CardProduct from "@/components/dashboard/products/CardProduct";

// Define the Product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stripePriceId: string;
  stripeId: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.data);

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: "#c3cfe2 ",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper sx={{ padding: 4, borderRadius: 2, width: "90%" }}>
        <CreateProductModal setProducts={setProducts} />
        <Typography variant="h1" color="primary" textAlign={"center"}>
          Products
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexWrap={"wrap"}
        >
          {loading && <SkeletonLoadingProducts />}

          {products.length > 0 &&
            products.map((product) => (
              <CardProduct
                key={product._id}
                setProducts={setProducts}
                product={product}
              />
            ))}

          {products.length === 0 && !loading && (
            <Typography variant="body1">No products found</Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProductsPage;
