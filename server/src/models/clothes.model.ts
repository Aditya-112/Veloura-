import mongoose, { Document, Schema } from "mongoose";

export interface IClothes extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  publicId: string;
  name?: string;
  category: string;
  subcategory: string;
  color: {
    primary: string;
    secondary?: string;
    hex?: string;
  };
  pattern: string[];
  material: string[];
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  formalityGrade?: number;
  styleProfile?: string;
  breathability?: string;
  warmthRating?: number;
  season: string[];
  occasion: string[];
  confidence?: number;
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
    name: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      default: "",
    },
    color: {
      primary: {
        type: String,
        default: "Indigo",
      },
      secondary: {
        type: String,
        default: "",
      },
      hex: {
        type: String,
        default: "#4f46e5",
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
    fit: {
      type: String,
      default: "",
    },
    sleeveType: {
      type: String,
      default: "",
    },
    neckType: {
      type: String,
      default: "",
    },
    formalityGrade: {
      type: Number,
      min: 1,
      max: 5,
    },
    styleProfile: {
      type: String,
      default: "Smart Casual",
    },
    breathability: {
      type: String,
      default: "High",
    },
    warmthRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    season: {
      type: [String],
      default: [],
    },
    occasion: {
      type: [String],
      default: [],
    },
    confidence: {
      type: Number,
      default: 0.95,
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