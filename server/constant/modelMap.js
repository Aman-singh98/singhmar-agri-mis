import Dealer from "../models/Dealer.js";
import TdsRecord from "../models/TdsRecord.js";
import TallyBill from "../models/Tallybill.js";
import Subsidy from "../models/Subsidy.js";
import Micada from "../models/Micada.js";
import MainFile from "../models/MainFile.js";
import Inventory from "../models/Inventory.js";
import FarmerShareDetail from "../models/FarmerShareDetail.js";
import MainRecord from "../models/MainRecord.js";
import MaterialDispatched from "../models/materialDispatchDetails/MaterialDispatched.js";
import AdjustedSheet from "../models/materialDispatchDetails/AdjustedSheet.js";
import Receipt from "../models/materialDispatchDetails/Receipt.js";
import ItemRate from "../models/ItemRate.js";
import DealerItemRate from "../models/DealerItemRate.js";

export const modelMap = {
   "dealer": Dealer,
   "tds-record": TdsRecord,
   "tally-bill": TallyBill,
   "subsidy": Subsidy,
   "micada": Micada,
   "main-file": MainFile,
   "inventory": Inventory,
   "farmer-share": FarmerShareDetail,
   "main-fySheet": MainRecord,
   "material-dispatch": MaterialDispatched,
   "material-dispatch-dispatched": MaterialDispatched,
   "material-dispatch-receipts": Receipt,
   "material-dispatch-adjusted": AdjustedSheet,
   "item-rate": ItemRate,
   "dealer-item-rate": DealerItemRate,
};