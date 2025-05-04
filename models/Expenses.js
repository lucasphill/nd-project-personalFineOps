import mongoose from "mongoose";

const ExpensesSchema = new mongoose.Schema({
    valor: Number,
    descricao: String,

});

export default mongoose.model("Register", ExpensesSchema);

// tipo, valor, categoria, data e descrição