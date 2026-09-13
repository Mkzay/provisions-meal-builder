import { isCookingOil, isFruit } from "./ingredient-categories";
import { clean, cleanBase, DishBlueprint } from "./dish-blueprints-types";

export const CORE_DISH_BLUEPRINTS: DishBlueprint[] = [
  // 1. Swallows (Amala, Fufu, Semo, Tuwo, Wheat)
  {
    id: "amala-ewedu-stew",
    name: "Swallow with Soup & Stew",
    basePattern: /amala|elubo|yam flour|fufu|akpu|semo|semovita|tuwo|wheat meal/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/croaker|fish|catfish|titus/i, /beef|goat|shaki|ponmo/i, /chicken|turkey/i],
    preferredSidePatterns: [/ewedu/i, /okra/i, /efo|spinach|bitterleaf/i],
    culinaryNote: "Warm velvety swallow paired with traditional soup and seasoned protein.",
    generateTitle: (base, protein, sides) => {
      const soup = (sides || []).find((s) => /ewedu|okra|efo|spinach|bitterleaf/i.test(s.name));
      let t = `${cleanBase(base.name)} with ${soup ? clean(soup.name) : "Savory Stew"}`;
      if (protein) t += ` & ${clean(protein.name)}`;
      return t;
    },
  },
  // 2. Rice & Beans (Iconic Nigerian duo)
  {
    id: "rice-and-beans",
    name: "Rice & Beans Combo",
    basePattern: /^(?!.*(?:swallow|tuwo))\b.*rice.*/i,
    requiredPatterns: [/bean/i],
    preferredProteinPatterns: [/croaker|fish|titus/i, /beef/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|salad|coleslaw/i],
    culinaryNote: "Classic tender rice and honey beans paired with rich savory stew.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Beans with Stew`;
      if (protein && !clean(protein.name).toLowerCase().includes("bean")) t += ` & ${clean(protein.name)}`;
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` + ${clean(dodo.name)}`;
      return t;
    },
  },
  // 3. Ofada Rice with Ayamase (Designer Stew)
  {
    id: "ofada-rice-ayamase",
    name: "Ofada Rice with Spicy Ayamase",
    basePattern: /ofada|rice/i,
    requiredPatterns: [/ayamase|ofada sauce|iru|locust bean|green pepper/i],
    preferredProteinPatterns: [/egg/i, /beef|shaki|ponmo|assorted/i, /croaker|fish/i],
    preferredSidePatterns: [/plantain|dodo/i],
    culinaryNote: "Aromatic indigenous rice paired with bleached palm oil green pepper Ayamase and boiled egg.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} with Spicy Ayamase`;
      if (protein) t += ` & ${clean(protein.name)}`;
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` + ${clean(dodo.name)}`;
      return t;
    },
  },
  // 4. Nigerian Party Fried Rice
  {
    id: "nigerian-fried-rice",
    name: "Nigerian Party Fried Rice",
    basePattern: /^(?!.*(?:swallow|tuwo))\b.*rice.*/i,
    requiredPatterns: [/carrot|green pea|sweet corn|green bean|curry/i],
    preferredProteinPatterns: [/chicken/i, /turkey/i, /beef|liver/i, /shrimp|prawn/i, /fish/i],
    preferredSidePatterns: [/plantain|dodo/i, /coleslaw|salad|cabbage/i, /moimoi|moi moi/i],
    culinaryNote: "Savory curry-infused rice stir-fried with crisp sweet veggies and golden protein.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Nigerian Fried ${cleanBase(base.name)}`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` & ${clean(dodo.name)}`;
      return t;
    },
  },
  // 5. Classic Nigerian Jollof Rice
  {
    id: "classic-jollof-rice",
    name: "Smoky Nigerian Jollof Rice",
    basePattern: /jollof/i,
    preferredProteinPatterns: [/chicken/i, /turkey/i, /beef/i, /croaker|fish/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /coleslaw|salad|cabbage/i, /moimoi|moi moi/i],
    culinaryNote: "Rich red one-pot parboiled rice simmered in roasted tomato, tatashe, and ginger reduction.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Smoky ${cleanBase(base.name)}`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` & ${clean(dodo.name)}`;
      return t;
    },
  },
  // 6. Rice & Savory Stew (Fallback when not Jollof/Fried/Beans)
  {
    id: "rice-savory-stew",
    name: "Rice & Savory Stew",
    basePattern: /^(?!.*(?:swallow|tuwo))\b.*rice.*/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/beef/i, /chicken/i, /croaker|fish/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|salad/i],
    culinaryNote: "Steamed fragrant rice bathed in savory spiced stew with cooked protein.",
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Tomato Stew`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => /plantain|dodo|cabbage|carrot|salad/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 7. Jollof Spaghetti / Pasta
  {
    id: "jollof-spaghetti",
    name: "Jollof Spaghetti",
    basePattern: /spaghetti|pasta/i,
    requiredPatterns: [/tomato|pepper|onion|stew/i],
    preferredProteinPatterns: [/egg/i, /croaker|fish|titus|mackerel/i, /beef/i, /chicken/i, /turkey/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|green bean/i],
    culinaryNote: "Simmered pasta in rich, seasoned tomato and aromatic pepper reduction.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Jollof ${cleanBase(base.name)}`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 8. White Spaghetti & Stew
  {
    id: "white-spag-stew",
    name: "Spaghetti & Savory Stew",
    basePattern: /spaghetti|pasta/i,
    preferredProteinPatterns: [/beef/i, /croaker|fish|titus/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot/i],
    culinaryNote: "Steamed pasta paired with savory tomato stew and wholesome protein.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Savory Stew`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 9. Spiced Nigerian Noodles (Indomie Combo)
  {
    id: "spiced-nigerian-noodles",
    name: "Spiced Nigerian Noodles",
    basePattern: /noodle|indomie|ramen/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    preferredProteinPatterns: [/egg/i, /sardine|tuna/i, /sausage/i, /chicken/i],
    preferredSidePatterns: [/plantain|dodo/i, /carrot|green pea|corn|cabbage/i],
    culinaryNote: "Quick seasoned noodles tossed with chili, vegetables, and pan-fried egg or sardines.",
    generateTitle: (base, protein, sides) => {
      let t = `Spiced ${cleanBase(base.name)}`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` & ${clean(dodo.name)}`;
      return t;
    },
  },
  // 10. Nigerian Peppersoup Pot (Tuber + Peppersoup Spice required)
  {
    id: "peppersoup-pot",
    name: "Nigerian Peppersoup Pot",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*(?:yam|potato|plantain).*/i,
    requiredPatterns: [/peppersoup/i],
    preferredProteinPatterns: [/chicken/i, /goat|beef|assorted|meat/i, /ponmo|kanda/i, /catfish|croaker|fish/i],
    preferredSidePatterns: [/ugwu|pumpkin leaf/i, /scent leaf|efirin|nchanwu/i, /spinach/i],
    culinaryNote: "Tender starchy tubers simmered in aromatic spicy broth infused with traditional peppersoup spices.",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      const protName = clean(protein?.name) || "Assorted Meat";
      const green = (sides || []).find((s) => /ugwu|scent leaf|efirin|spinach/i.test(s.name));
      let t = `${cleanBase(base.name)} Peppersoup with ${protName}`;
      if (green) t += ` & Shredded ${clean(green.name)}`;
      return t;
    },
  },
  // 11. Asaro (Savory Yam Porridge / Pottage)
  {
    id: "asaro-yam-porridge",
    name: "Asaro (Yam Porridge)",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*yam.*/i,
    requiredPatterns: [/palm oil|pepper|crayfish/i],
    preferredProteinPatterns: [/croaker|fish|titus|panla|smoked/i, /beef|ponmo/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/ugwu|spinach|efo/i, /plantain/i],
    culinaryNote: "Soft yam chunks stewed in rich palm oil, aromatic peppers, onions, and ground crayfish.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Asaro (${cleanBase(base.name)} Porridge)`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const green = (sides || []).find((s) => /ugwu|spinach|efo/i.test(s.name));
      if (green) t += ` & ${clean(green.name)}`;
      return t;
    },
  },
  // 12. Boiled Yam & Fresh Egg Sauce
  {
    id: "boiled-yam-egg-sauce",
    name: "Boiled Yam & Fresh Egg Sauce",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*yam.*/i,
    requiredPatterns: [/egg/i],
    preferredProteinPatterns: [/egg/i, /fish|sardine/i],
    preferredSidePatterns: [/plantain/i],
    culinaryNote: "Steamed tender yam paired with spiced scrambled egg sauce.",
    suitableMeals: ["Breakfast", "Lunch"],
    generateTitle: (base, protein, sides) => {
      const baseLabel = `Boiled ${cleanBase(base.name)}`;
      let t = clean(protein?.name).toLowerCase().includes("egg") ? `${baseLabel} & Fresh Egg Sauce` : `${baseLabel} with ${clean(protein?.name) || "Sauce"}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` with ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 13. Boiled Yam & Stew / Fish (Yam fallback)
  {
    id: "yam-fish-stew",
    name: "Yam with Savory Fish Stew",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*yam.*/i,
    preferredProteinPatterns: [/croaker|fish|titus|mackerel|panla/i, /beef/i, /egg/i],
    preferredSidePatterns: [/plantain/i, /spinach|efo/i],
    culinaryNote: "Steamed yam paired with savory stew for grounding, sustained energy.",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Boiled ${cleanBase(base.name)} & ${clean(protein?.name) || "Stew"}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !isFruit(s));
      if (valid.length > 0) t += ` with ${clean(valid[0].name)}`;
      return t;
    },
  },
];
