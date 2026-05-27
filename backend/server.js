const e = require("express");
const mongoose = require("mongoose");
const app = e();
const Alarm = require("./models/Alarm")
const http = require("http");

const server = http.createServer(app);
const cors = require("cors");
app.use(cors());

const { Server} = require("socket.io");
const io = new Server(server,{
  cors:{
    origin :"*",
  },
});

io.on("connection",(socket)=>{
  console.log("user Connected");

  socket.on("disconnect",()=>{
    console.log("user Disconnected");
  });
});

mongoose.connect("mongodb://localhost:27017/alarmDB").then(()=> console.log("mongoDB Connected Succefully")).catch((err)=> console.log(err));



app.use(e.json());

app.get("/", (req, res) => {
    res.send("Server Running Succesfully");
});



app.post("/alarms", async (req, res) => {
  try {
    const newAlarm = new Alarm({
      message: req.body.message,
      severity: req.body.severity,
    });

    await newAlarm.save();
    const latestAlarms = await Alarm.find().sort({createdAt : -1}).limit(10);
    io.emit("alarmUpdated",latestAlarms)

    res.status(201).json({
      message: "Alarm saved successfully",
      data: newAlarm,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


app.get("/alarms", async (req, res) => {
  try {
    const alarms = await Alarm.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(alarms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


server.listen(5000,()=>{
    console.log("Server is running on port 5000");
})
