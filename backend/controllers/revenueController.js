const Revenue = require("../models/revenueModel")

const RevenueData = async (req, res) => {
    try {
      // Fetch the most recent revenue data
      const revenueData = await Revenue.findOne().sort({ updatedAt: -1 }); // Sort by latest entry
  
      if (revenueData) {
        res.json({ totalRevenue: revenueData.totalRevenue });
      } else {
        // If no revenue data exists, return 0
        res.json({ totalRevenue: 0 });
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      res.status(500).json({ error: 'Error fetching revenue data' });
    }
  };
  
  // Optional: Simulate revenue updates every 10 seconds
  setInterval(async () => {
    try {
      // Fetch the latest revenue
      const latestRevenue = await Revenue.findOne().sort({ updatedAt: -1 });
  
      let newRevenue;
  
      if (latestRevenue) {
        newRevenue = latestRevenue.totalRevenue + 50; // Increase the revenue by 50 for simulation
      } else {
        newRevenue = 5050; // Initial revenue if no data exists
      }
  
      // Create a new revenue record with the updated revenue
      const updatedRevenue = new Revenue({ totalRevenue: newRevenue });
      await updatedRevenue.save();
      console.log('Revenue updated to:', newRevenue);
    } catch (error) {
      console.error('Error updating revenue:', error);
    }
  }, 10000); // Every 10 seconds

module.exports = RevenueData