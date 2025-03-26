const Event = require("../models/Event");

exports.getDashboardStats = async (req, res) => {
   try {
      const totalEvents = await Event.countDocuments();
      const approvedEvents = await Event.countDocuments({ status: "approved" });
      const pendingEvents = await Event.countDocuments({ status: "pending" });
      const cancelledEvents = await Event.countDocuments({ status: "cancelled" });

      const totalTicketsSold = await Event.aggregate([{ $group: { _id: null, total: { $sum: "$ticketSold" } } }]);
      const totalRefunds = await Event.aggregate([{ $group: { _id: null, total: { $sum: "$refunds" } } }]);

      res.json({
         totalEvents,
         approvedEvents,
         pendingEvents,
         cancelledEvents,
         totalTicketsSold: totalTicketsSold[0]?.total || 0,
         totalRefunds: totalRefunds[0]?.total || 0,
      });
   } catch (error) {
      res.status(500).json({ message: "Server Error" });
   }
};
