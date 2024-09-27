const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const generateToken = require("../utils/index");

const adminRegister = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      res.status(400).json({ error: "Please fill all the required fields" });
    }
    password.length < 6 &&
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters" })();

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const admin = await Admin.create({ firstName, email, password });

    const token = generateToken(admin._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    if (admin) {
      const { _id, firstName, email, password, role } = admin;

      res.status(201).json({ _id, firstName, email, role, token });
    } else {
      throw new Error("Invalid data");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    if (admin && isMatch) {
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      const { _id, firstName, email, role } = admin;

      res.status(201).json({
        _id,
        firstName,
        email,
        role,
        token,
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const getAdmins = async (req, res) => {
  const admins = await Admin.find().sort("-createdAt").select("-password");
  if (!admins) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(admins);
};

const getAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);

    if (admin) {
      const { _id, firstName, email, role } = admin;

      res.status(200).json({
        _id,
        firstName,
        email,
        role,
      });
    } else {
      res.status(500);
      throw new Error("Admin not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      console.error(`User with ID ${adminId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const { firstName, email, role } = req.body;

    if (firstName) admin.firstName = firstName;
    if (email) admin.email = email;
    if (role) admin.role = role;

    const updatedAdminDetails = await admin.save();
    res.json(updatedAdminDetails);
  } catch (error) {
    console.error("error updating message", error);
    res.status(400).json({ message: error.message });
  }
};

const logoutAdmin = async (req, res) => {
  res.cookie("token", "none", {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now()), // Set expiration to now to effectively delete the cookie
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({ message: "Admin logged out successfully" });
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ message: "Admin data deleted successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  getAdmins,
  getAdmin,
  updateAdmin,
  logoutAdmin,
  deleteAdmin,
};
