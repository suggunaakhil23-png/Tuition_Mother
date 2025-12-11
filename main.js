require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const data1 = require("./data.js");

const app = express();

const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}
main()
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch(err => console.log(err));

    app.get("/", (req, res) => {
          res.redirect("/main");
    });

app.get("/main", (req, res) => {
    res.render("dashboard.ejs");
});

app.get("/fees", async (req, res) => {
    const students = await data1.find();
    res.render("fees.ejs", { data: students });
});

app.get("/update", async (req, res) => {
    const students = await data1.find();
    res.render("updatefee.ejs", { data: students });
});

app.get("/enroll", (req, res) => {
    res.render("enroll.ejs");
});

app.get("/students", async (req, res) => {
    const students = await data1.find();
    res.render("students.ejs", { data: students });
});

app.post("/enroll", async (req, res) => {
    const { name, clas, fee } = req.body;

    try {
        const student = new data1({ name, clas, fee });
        await student.save();
        res.redirect("/students");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error enrolling student");
    }
});

app.post("/update", async (req, res) => {
    const { name, status, date } = req.body;

    try {
        const student = await data1.findOne({ name });
        if (!student) return res.status(404).send("Student not found");

        await student.updateOne({
            status: status,
            month: date
        });

        res.redirect("/fees");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating student");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
