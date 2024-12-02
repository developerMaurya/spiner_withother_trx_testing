import connection from "../config/connectDB";
import jwt from 'jsonwebtoken'
import request from 'request';
import e from "express";
require('dotenv').config();

const spinerPage = async (req, res) => {
    console.log("enter in spiner page....")
    return res.render("spiner/spiner_index.ejs");
}

// const spinAction = async (req, res) => {
//     try {
//         // Get the user's auth token from cookies
//         let auth = req.cookies.auth;
//         console.log("auth is ......", auth);

//         if (!auth) {
//             return res.status(401).json({ message: "User not authenticated" });
//         }

//         // Fetch the user's details from the database using the auth token
//         const [user] = await connection.query('SELECT `id`, `phone`, `code`, `money`, `invite` FROM users WHERE `token` = ?', [auth]);
//         console.log("user.....", user);

//         if (user.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         let currentMoney = user[0].money;
//         let userId = user[0].id;

//         // Check if the user has enough money to spin
//         if (currentMoney < 10) {
//             return res.status(400).json({ message: "Not enough money to spin" });
//         }

//         // Deduct 10 rupees from the user's balance
//         await connection.execute("UPDATE users SET money = money - 10 WHERE id = ?", [userId]);

//         // Get the winning amount from the frontend
//         const { winningAmount } = req.body;
//         console.log("winning amount is ....", winningAmount);

//         // Update the user's balance with the winning amount
//         await connection.execute("UPDATE users SET money = money + ? WHERE id = ?", [winningAmount, userId]);

//         // Send the updated money as response
//         return res.status(200).json({
//             winningAmount: winningAmount,
//             updatedMoney: currentMoney - 10 + winningAmount
//         });

//     } catch (error) {
//         console.error("Error in spinAction:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const spinAction = async (req, res) => {
    try {
        let auth = req.cookies.auth;

        if (!auth) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const [user] = await connection.query('SELECT `id`, `money`, `last_spin_date` FROM users WHERE `token` = ?', [auth]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        let currentMoney = user[0].money;
        let userId = user[0].id;
        let lastSpinDate = user[0].last_spin_date;

        const today = new Date().toISOString().split('T')[0];

        if (lastSpinDate && lastSpinDate === today) {
            return res.status(403).json({ message: "You cannot spin today. Try again tomorrow for better luck." });
        }

        if (currentMoney < 10) {
            return res.status(400).json({ message: "Not enough money to spin" });
        }

        await connection.execute("UPDATE users SET money = money - 10 WHERE id = ?", [userId]);

        const { winningAmount } = req.body;

        await connection.execute("UPDATE users SET money = money + ?, last_spin_date = ? WHERE id = ?", [winningAmount, today, userId]);

        return res.status(200).json({
            winningAmount: winningAmount,
            updatedMoney: currentMoney - 10 + winningAmount
        });

    } catch (error) {
        console.error("Error in spinAction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {
    spinerPage,
    spinAction
}