"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import EditProductModal from "./EditProductModal";
import { Product } from "./ProductsPage";

const CardProduct = ({
  product,
  disableButtons,
  setProducts,
}: {
  product: Product;
  disableButtons?: boolean;
  setProducts: (value: React.SetStateAction<Product[]>) => void;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: product._id }),
      });
      const data = await response.json();
      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== product._id)
        );
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <Card sx={{ width: 345, height: 390 }}>
      <CardMedia
        component="img"
        alt="image of product"
        image={product.image}
        loading="lazy"
        sx={{ height: 230 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              overflow: "visible",
              whiteSpace: "normal",
            },
          }}
        >
          {product.description}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.price}$
        </Typography>
      </CardContent>
      <CardActions>
        <EditProductModal setProducts={setProducts} product={product} />
        <Button
          disabled={disableButtons}
          size="small"
          onClick={handleOpenDeleteModal}
        >
          Delete
        </Button>
      </CardActions>
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Are you sure you want to delete this product?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
            sx={{ marginRight: 2 }}
          >
            Delete
          </Button>
          <Button variant="contained" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default CardProduct;
