const express = require("express");
const { adminRegister, adminLogin, getAdmins, getAdmin, updateAdmin, deleteAdmin, logoutAdmin } = require("../controllers/adminController");
const router = express.Router();

router.post("/create", adminRegister)
router.post("/login", adminLogin)
router.get("/", getAdmins)
router.get("/:adminId", getAdmin)
router.put("/:adminId", updateAdmin)
router.post("/logout", logoutAdmin)
router.delete("/:adminId", deleteAdmin)

module.exports = router;