"use client";
import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, Grid } from "@mui/material";
import CardProduct from "@/components/dashboard/products/CardProduct";
import { Product } from "./ProductsPage";

const CreateProductModal = ({
  setProducts,
}: {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCreateProduct = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.success) {
        setProducts((prevProducts) => [...prevProducts, data.data]);
        setNewProduct({ name: "", price: 0, description: "", image: "" });
        handleClose();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New Product
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
            Create New Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Image"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 30 }}
                helperText={`${newProduct.name.length}/30`}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 100 }}
                helperText={`${newProduct.description.length}/100`}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateProduct}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Create Product
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleClose}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary">
                Product Preview
              </Typography>
              <CardProduct
                setProducts={setProducts}
                product={newProduct as Product}
                disableButtons
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default CreateProductModal;
