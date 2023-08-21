// This file contains functions that are used in multiple files to reduce code duplication

// Used in:
// home/explore.js
// onboarding/category.js
// profile/show.js
// wishlist/index.js
export function avatarImage(name) { // Get avatar image
    switch (name) { // Switch name based on name parameter
    case 'coffee':
        return require(`../assets/icons/coffee.png`);
    case 'beer':
        return require(`../assets/icons/beer.png`);
    case 'chocolate':
        return require(`../assets/icons/chocolate.png`);
    case 'tea':
        return require(`../assets/icons/tea.png`);
    case 'cheese':
        return require(`../assets/icons/cheese.png`);
    case 'hotsauce':
        return require(`../assets/icons/hotsauce.png`);
    case 'hotsauce':
        return require(`../assets/icons/hotsauce.png`);
    case 'keurig':
        return require(`../assets/icons/keurig.png`);
    case 'kombucha':
        return require(`../assets/icons/kombucha.png`);
    case 'nespresso':
        return require(`../assets/icons/nespresso.png`);
    case 'oliveoil':
        return require(`../assets/icons/oliveoil.png`);
    case 'salts':
        return require(`../assets/icons/salts.png`);
    case 'seasonings':
        return require(`../assets/icons/seasonings.png`);
    case 'spices':
        return require(`../assets/icons/spices.png`);
    case 'tea':
        return require(`../assets/icons/tea.png`);
    case 'vinegars':
        return require(`../assets/icons/vinegars.png`);
    default:
        return require(`../assets/icons/coffee.png`);
    }
}

//Used in:
// home/explore.js
// profile/show.js 
// wishlist/index.js
export function avatarImageWhite(name) {
    switch (name) {
    case 'coffee':
        return require(`../assets/icons/coffee-white.png`);
    case 'chocolate':
        return require(`../assets/icons/chocolate-white.png`);
    case 'tea':
        return require(`../assets/icons/tea-white.png`);
    case 'cheese':
        return require(`../assets/icons/cheese-white.png`);
    case 'hotsauce':
        return require(`../assets/icons/hotsauce-white.png`);
    case 'hotsauce':
        return require(`../assets/icons/hotsauce-white.png`);
    case 'keurig':
        return require(`../assets/icons/keurig-white.png`);
    case 'kombucha':
        return require(`../assets/icons/kombucha-white.png`);
    case 'nespresso':
        return require(`../assets/icons/nespresso-white.png`);
    case 'oliveoil':
        return require(`../assets/icons/oliveoil-white.png`);
    case 'salts':
        return require(`../assets/icons/salts-white.png`);
    case 'seasonings':
        return require(`../assets/icons/seasonings-white.png`);
    case 'spices':
        return require(`../assets/icons/spices-white.png`);
    case 'tea':
        return require(`../assets/icons/tea-white.png`);
    case 'vinegars':
        return require(`../assets/icons/vinegars-white.png`);
    default:
        return require(`../assets/icons/coffee-white.png`);
    }
}

//Used in product/rate.js
export function generateRandomColor(name) {
    switch (name) {
    case 'Roasted':
        return '#E9C46A';
    case 'Smoky':
        return '#E9C46A';
    case 'Tobacco':
        return '#E9C46A';
    case 'Spicy':
        return '#E9C46A';
    case 'Anise':
        return '#E9C46A';
    case 'Peppery':
        return '#E9C46A';
    case 'Cinnamon':
        return '#E9C46A';
    case 'Nutty':
        return '#F3A161';
    case 'Chocolate':
        return '#F3A161';
    case 'Sweet':
        return '#F3A161';
    case 'Caramel':
        return '#F3A161';
    case 'Vanilla':
        return '#F3A161';
    case 'Floral':
        return '#E76E50';
    case 'Fruity':
        return '#E76E50';
    case 'Berries':
        return '#E76E50';
    case 'Citrus':
        return '#E76E50';
    case 'Stone Fruit':
        return '#E76E50';
    case 'Sour':
        return '#2A9C8E';
    case 'Vegetal':
        return '#2A9C8E';
    case 'Woody':
        return '#0BA1B5';
    case 'Rubber':
        return '#0BA1B5';
    case 'Salty':
        return '#0BA1B5';
    case 'Bitter':
        return '#0BA1B5';
    default:
        return '#F3A160';
    }
}
