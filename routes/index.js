import expressRouter from "express";
import userRouter from "./userRouter.js";
import customerRouter from "./customerRouter.js";
import categoryRouter from "./categoryRouter.js";
import subcategoryRouter from "./subcategoryRouter.js";
import productRouter from "./productRouter.js";
import customerAddressRouter from "./customerAddressRouter.js";

const appRoutes = expressRouter();

appRoutes.use("/user", userRouter);
appRoutes.use("/customer",customerRouter);
appRoutes.use("/category",categoryRouter);
appRoutes.use("/subcategory",subcategoryRouter);
appRoutes.use("/product",productRouter);
appRoutes.use("/customerAddress",customerAddressRouter);

export default appRoutes;