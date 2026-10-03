const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/ai.service');

const concierge = asyncHandler(async (req, res) => {
  const { conversationHistory } = req.body;
  if (!conversationHistory || !Array.isArray(conversationHistory)) {
    return res.status(400).json({ success: false, message: 'conversationHistory array is required' });
  }

  const result = await aiService.aiConcierge(conversationHistory);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  concierge
};
