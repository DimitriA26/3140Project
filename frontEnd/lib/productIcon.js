import {
  Mouse,
  Keyboard,
  Headphones,
  BookOpen,
  Footprints,
  Lamp,
  Shirt,
  Dumbbell,
  Laptop,
  Package,
} from "lucide-react";

// Maps a product to a simple representative icon instead of a photo.
// Checked in order: specific name keywords first, then category, then a
// generic fallback so any future admin-added product still gets an icon.
const NAME_ICONS = [
  [/mouse/i, Mouse],
  [/keyboard/i, Keyboard],
  [/headphone/i, Headphones],
  [/book/i, BookOpen],
  [/shoe/i, Footprints],
  [/lamp/i, Lamp],
  [/shirt/i, Shirt],
  [/mat|yoga/i, Dumbbell],
];

const CATEGORY_ICONS = {
  Electronics: Laptop,
  Books: BookOpen,
  Clothing: Shirt,
  Home: Lamp,
  Sports: Dumbbell,
};

export function getProductIcon(product) {
  const name = product?.name || "";

  for (const [pattern, Icon] of NAME_ICONS) {
    if (pattern.test(name)) {
      return Icon;
    }
  }

  return CATEGORY_ICONS[product?.category_name] || Package;
}
