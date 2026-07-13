export type ClothingCategory= 
|"Top"
|"Bottom"
|"Shoes"
|"Outerwear"
|"Accessories";

export interface ClothingMetadata{
    category:ClothingCategory;
    subcategory:string;

    primaryColor : string;
    secondaryColor:string ;

    pattern:string[];
    material:string[];

    season:string[];
    occasion:string[];
}