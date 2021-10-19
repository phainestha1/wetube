import "dotenv/config";
import "./db";
import "./model/videoModel";
import "./model/userModel";
import "./model/commentModel";
import app from "./server";

// Application Listening & PORT No. Setting
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server on PORT localhost:${PORT} 🔥`);
});
