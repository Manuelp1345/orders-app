"use client";
import { Box, Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoadingProducts = () => {
  return (
    <>
      <Box sx={{ width: 345, height: 390 }}>
        <Skeleton variant="rectangular" width={345} height={230} />
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </Box>
      <Box sx={{ width: 345, height: 390 }}>
        <Skeleton variant="rectangular" width={345} height={230} />
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </Box>
      <Box sx={{ width: 345, height: 390 }}>
        <Skeleton variant="rectangular" width={345} height={230} />
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </Box>
    </>
  );
};

export default SkeletonLoadingProducts;
