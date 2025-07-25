import { Router } from "express";
import { ChatController } from "../controller/chat.controller.js";

export const chatRouter = Router();

chatRouter.post('/chat', ChatController.chatWithIA);
