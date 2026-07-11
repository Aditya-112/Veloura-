import mongoose, { Document, Schema } from "mongoose";

export interface IClothes extends Document {
  user: mongoose.Types.ObjectId;

  imageUrl: string;
  publicId: string;

  category:
    | "Top"
    | "Bottom"
    | "Shoes"
    | "Outerwear"
    | "Accessories";

  subcategory: string;

  color: {
    primary: string;
    secondary?: string;
}
  pattern: string[];
  material: string[];

  season: string[];
  occasion: string[];

  favorite: boolean;

  timesUsed: number;
}

const clothesSchema = new Schema<IClothes>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Top", "Bottom", "Shoes", "Outerwear", "Accessories"],
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    color: {
        primary:{
      type: String,
      default: "",
        },
        secondary:{
            type:String,
            default:"",
        },
    },

    pattern: {
  type: [String],
  default: [],
},

material: {
  type: [String],
  default: [],
},

    season: {
      type: [String],
      default: [],
    },

    occasion: {
      type: [String],
      default: [],
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Clothes = mongoose.model<IClothes>("Clothes", clothesSchema);

export default Clothes;