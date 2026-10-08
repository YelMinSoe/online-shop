//Packages imports
import "dotenv/config";

// Local imports
import { app } from "./app.ts";

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
