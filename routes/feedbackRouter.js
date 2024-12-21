import express from "express";
import {
    createFeedback,
    deleteFeedback,
    fetchById,
    findAllFeedbacks,
    findFeedbackByCustomerId,
    findFeedbackByProductId,
    getFeedbackByCustAndProdId,
    getRatingCounts,
    updateFeedback
} from "../controller/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.route("/create").post(createFeedback);
feedbackRouter.route("/getAll").get(findAllFeedbacks);
feedbackRouter.route("/getByProductId/:productId").get(findFeedbackByProductId);
feedbackRouter.route("/getByCustomerId/:customerId").get(findFeedbackByCustomerId);
feedbackRouter.route("/getById/:id").get(fetchById);
feedbackRouter.route("/update").post(updateFeedback);
feedbackRouter.route("/delete").delete(deleteFeedback);
feedbackRouter.route("/getFeedbackByCustAndProdId").get(getFeedbackByCustAndProdId);
feedbackRouter.route("/getRatingCounts/:productId").get(getRatingCounts);


export default feedbackRouter;