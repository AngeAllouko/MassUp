// Nutrition values are per 100 g.
export const CATEGORIES = ['All', 'Meals', 'Protein', 'Grains', 'Vegetables', 'Fruits'];

const f = (name, calories, protein, carbs, fat, category, extra = {}) => ({
  name, calories, protein, carbs, fat, category, ...extra,
});

export const FOODS = [
  // New dishes
  f('Chicken fried rice', 170, 8, 24, 5, 'Meals', { isNew: true }),
  f('Chicken noodles', 165, 10, 20, 5, 'Meals', { isNew: true }),

  // Meals
  f('Attiéké', 148, 1.2, 34, 0.5, 'Meals'),
  f('Banana foutou', 160, 1.5, 38, 0.3, 'Meals'),
  f('Yam foutou', 155, 1.8, 36, 0.2, 'Meals'),
  f('Palm nut sauce', 210, 4, 8, 18, 'Meals'),
  f('Chicken kedjenou', 175, 22, 5, 8, 'Meals'),
  f('Aloko (fried plantain)', 180, 1.2, 28, 7, 'Meals'),
  f('Garba', 290, 18, 38, 6, 'Meals'),
  f('Rice with tomato sauce', 195, 5, 35, 4, 'Meals'),
  f('Thieboudienne', 220, 14, 28, 6, 'Meals'),
  f('Mafé', 240, 16, 12, 14, 'Meals'),
  f('Kandia soup', 185, 10, 8, 12, 'Meals'),
  f('Millet couscous', 170, 5, 35, 1.5, 'Meals'),
  f('Fish tchep', 245, 18, 32, 6, 'Meals'),
  f('Meat tchep', 260, 20, 31, 7, 'Meals'),
  f('Attiéké with 2 eggs', 310, 15, 36, 11, 'Meals'),
  f('Attiéké with grilled fish', 275, 22, 34, 7, 'Meals'),
  f('Attiéké with chicken', 290, 24, 34, 8, 'Meals'),
  f('Riz gras (savory rice)', 230, 8, 38, 6, 'Meals'),
  f('Placali with palm nut sauce', 280, 6, 42, 11, 'Meals'),
  f('Foutou with peanut sauce', 310, 10, 40, 13, 'Meals'),
  f('Bangui (palm wine)', 70, 0.5, 17, 0, 'Meals'),
  f('Millet porridge', 95, 3, 19, 1.5, 'Meals'),
  f('Alloco with chicken', 320, 22, 30, 12, 'Meals'),
  f('Fish soup', 140, 18, 6, 5, 'Meals'),
  f('Riz gras with mutton', 275, 16, 32, 9, 'Meals'),
  f('Djoumblé', 165, 8, 12, 9, 'Meals'),
  f('Light fish sauce', 110, 14, 4, 4, 'Meals'),

  // Protein
  f('Grilled chicken', 165, 31, 0, 3.6, 'Protein'),
  f('Grilled fish', 150, 28, 0, 4, 'Protein'),
  f('Canned tuna', 132, 29, 0, 1, 'Protein'),
  f('Whole egg', 155, 13, 1.1, 11, 'Protein'),
  f('Lean beef', 158, 26, 0, 5.5, 'Protein'),
  f('Sardines', 208, 25, 0, 11, 'Protein'),
  f('Red beans', 127, 8.7, 22, 0.5, 'Protein'),
  f('Lentils', 116, 9, 20, 0.4, 'Protein'),
  f('Peanuts', 567, 26, 16, 49, 'Protein'),

  // Grains
  f('White rice (cooked)', 130, 2.7, 28, 0.3, 'Grains'),
  f('Sandwich bread', 265, 9, 49, 3.2, 'Grains'),
  f('Pasta (cooked)', 158, 5.8, 31, 0.9, 'Grains'),
  f('Corn flour', 362, 7, 76, 3.5, 'Grains'),
  f('Oats', 389, 17, 66, 7, 'Grains'),

  // Vegetables
  f('Boiled yam', 118, 1.5, 28, 0.1, 'Vegetables'),
  f('Sweet potato', 86, 1.6, 20, 0.1, 'Vegetables'),
  f('Okra', 33, 1.9, 7, 0.2, 'Vegetables'),
  f('African eggplant', 25, 1, 6, 0.2, 'Vegetables'),
  f('Tomato', 18, 0.9, 3.9, 0.2, 'Vegetables'),
  f('Onion', 40, 1.1, 9, 0.1, 'Vegetables'),

  // Fruits
  f('Plantain', 122, 1.3, 32, 0.4, 'Fruits'),
  f('Mango', 60, 0.8, 15, 0.4, 'Fruits'),
  f('Avocado', 160, 2, 9, 15, 'Fruits'),
  f('Papaya', 43, 0.5, 11, 0.3, 'Fruits'),
  f('Pineapple', 50, 0.5, 13, 0.1, 'Fruits'),
  f('Orange', 47, 0.9, 12, 0.1, 'Fruits'),
  f('Coconut (flesh)', 354, 3.3, 15, 33, 'Fruits'),
];

// Lower-case and strip accents so "attieke" matches "Attiéké".
export const fold = (str) =>
  str
    .toLowerCase()
    .replace(/[àâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c');
