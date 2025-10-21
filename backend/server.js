const express = require('express');
const app = express();
app.use(express.json());

const aiRoutes = require('./routes/aiRoutes');
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
