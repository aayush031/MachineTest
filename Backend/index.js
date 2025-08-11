import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "200mb" })); // allow bigger JSON payloads
app.use(express.urlencoded({ limit: "200mb", extended: true })); // for form data


// ===== MongoDB Connect =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Employee Schema =====
const employeeSchema = new mongoose.Schema({
  f_Id: Number,
  f_Name: String,
  f_Email: String,
  f_Mobile: String,
  f_Designation: String,
  f_gender: String,
  f_Course: [String],
  f_Image: String,
});
const Employee = mongoose.model("Employee", employeeSchema);

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// ===== Middleware: Verify token =====
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ===== Login Route =====
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid username" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, username });
});




// ===== Get all employees =====
app.get("/api/employees", auth, async (req, res) => {
  const search = req.query.search || "";
  const employees = await Employee.find({ f_Name: { $regex: search, $options: "i" } });
  res.json(employees);
});

// ===== Get single employee =====
app.get("/api/employees/:id", auth, async (req, res) => {
  const emp = await Employee.findOne({ f_Id: req.params.id });
  res.json(emp);
});

// ===== Create employee =====
app.post("/api/employees", auth, async (req, res) => {
  const count = await Employee.countDocuments();
  const newEmp = await Employee.create({ ...req.body, f_Id: count + 1 });
  res.json(newEmp);
});

// ===== Update employee =====
app.put("/api/employees/:id", auth, async (req, res) => {
  const emp = await Employee.findOneAndUpdate(
    { f_Id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(emp);
});

// ===== Delete employee =====
app.delete("/api/employees/:id", auth, async (req, res) => {
  try {
    const deleted = await Employee.deleteOne({ f_Id: req.params.id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

// ===== Seed admin user (safe version) =====
app.get("/seed", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      return res.send("Admin user already exists");
    }

    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ username: "admin", password: hashed });
    res.send("Seeded admin user");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error seeding admin user");
  }
});

// ===== Start Server =====
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
