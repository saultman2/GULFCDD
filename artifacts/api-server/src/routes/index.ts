import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeRouter from "./stripe";
import contactRouter from "./contact";
import accountRouter from "./account";
import widgetRouter from "./widget";
import intakeRouter from "./intake";
import campaignRouter from "./campaign";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeRouter);
router.use(contactRouter);
router.use(accountRouter);
router.use(widgetRouter);
router.use(intakeRouter);
router.use(campaignRouter);

export default router;
