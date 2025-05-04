import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import Expenses from "./models/Expenses.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const conn = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
}

conn();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.post("/expenses", async(req, res) => {
    try {
        const newExpense = await Expenses.create(req.body);
        res.json(newExpense);
    } catch (error) {
        console.log("Error when add new register", error);
        res.send({ error: error});
    }
});

app.post("/expensesoai", async(req, res) => {
    try {
        const message = req.body.message?.text || '';
        const chatId = req.body.message?.chat?.id;

        const response = await axios.post(process.env.OPENAI_API_URI,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                { role: 'system', content: 'Você é um assistente que transforma mensagens financeiras em JSON com: tipo, valor, categoria, data e descrição.' },
                { role: 'user', content: message }
                ],
                temperature: 0.2
            },
            {
                headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
                }
            }
        );
        res.send({ message: response });
    } catch (error) {
        console.log("Error when add new register", error);
        res.send({ error: error});
    }
});

// app.post("/expensesds", async(req, res) => {
//     try {
//         const message = req.body.message?.text || '';
//         const chatId = req.body.message?.chat?.id;

//         const response = await axios.post(
//             process.env.DEEPSEEK_API_URL,
//             {
//                 model: "deepseek-chat", // Verifique o modelo correto (ex: "deepseek-v2")
//                 messages: [
//                     { role: "system", content: 'Você é um assistente que transforma mensagens financeiras em JSON com: tipo, valor, categoria, data e descrição.' },
//                     { role: "user", content: message }
//                 ],
//                 temperature: 0.2,
//                 max_tokens: 500
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         res.send({ message: response });
//     } catch (error) {
//         console.log("Error when add new register", error);
//         res.send({ error: error});
//     }
// });

app.get("/expenses", async(req, res) => {
    try {
        const expenses = await Expenses.find();
        res.send(expenses);
    } catch (error) {
        console.log("Error when getting expenses", error);
        res.send({ error: error});
    }
})

app.post("/webhook", async(req, res) => {
    const message = req.body.message?.text || '';
    const chatId = req.body.message?.chat?.id;
    try {
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: `✅ Mensagem recebida com sucesso! - ${message}`
        });
        await Expenses.create(message);
        console.log(message)
        res.status(200).end();
    } catch (error) {
        console.log("Error in webhook", error);
        res.send({ error: error});
        if (chatId) {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: `❌ Erro ao processar seu registro: ${error}`
            });
        }
        res.status(500).end();
    }

    
})

app.listen(PORT, () => {
    console.log(`API is running and listening ${PORT}`)
})
