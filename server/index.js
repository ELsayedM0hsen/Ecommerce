const express = require("express");
const dbConnect = require("./config/dbConnect");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); 
const morgan = require("morgan");
const cors = require('cors');
require("dotenv").config();
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogCategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const supplierRouter = require("./routes/supplierRoute");
const importNoteRouter = require("./routes/importNoteRoute");
const paymentRouter = require("./routes/paymentRoute");



const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

//middeleware
app.use(morgan("dev"));
app.use(cors({
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials: true, 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/importNote", importNoteRouter);
app.use("/api/payment", paymentRouter);

//Handle Errors
app.use(notFound);
app.use(errorHandler);

// app.listen(PORT, () => {
//     console.log(`Server is running at PORT: ${PORT}`);
// })

mongoose.connection.once("open",() =>{
    console.log("mongoDB connected");
    app.listen(PORT,() => {
        dbConnect();
        console.log( `server in running in ${PORT}`);
    })
});

mongoose.connection.on("error",(err)=>{
    console.log(err);
})