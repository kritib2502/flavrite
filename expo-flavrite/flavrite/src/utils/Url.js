// const api_domain = 'http://192.168.31.40:8000/api/V1';
// const main_domain = 'http://192.168.31.40:8000';
//  const api_domain = 'http://127.0.0.1:8000/api/V1';
//const main_domain = 'http://127.0.0.1:8000';
const api_domain = 'https://api.flavrite.com/api/V1';
const main_domain = 'https://api.flavrite.com';
//const api_domain = 'http://192.168.1.98:8000/api/V1';
//const main_domain = 'http://192.168.1.76:8000'; 
export default {
    MEDIA: main_domain + '/storage/',
 
    // REGISTER
    GATE_API: api_domain + '/gate',
    GET_USER: api_domain + '/profile',
    DELETE_USER: api_domain + '/profile/delete',
    UPLOAD_PROFILE_IMG: api_domain + '/profile/image-upload',
    UPLOAD_PRODUCT_IMG: api_domain + '/product/image-upload-search',
    FAST_GATE: api_domain + '/fastlogin',

    // MEDIAS
    PROFILE_IMG: main_domain + '/storage/users/',
    CATEGORY_IMG: main_domain + '/storage/categories/',
    PRODUCT_IMG: main_domain + '/storage/flavas/',
    PLACES_IMG: main_domain + '/storage/places/',

    GET_CATEGORIES: api_domain + '/categories',
    GET_PLACES: api_domain + '/places',

    SEARCH_PRODUCT: api_domain + '/search/product?names=',

    HOME_CATEGORY_PRODUCTS: api_domain + '/product/category/',

    // FLAVA
    GET_FALAVA: api_domain + '/product/',
    ADD_FALAVA: api_domain + '/product/store',
    UPLOAD_FALAVA_IMG: api_domain + '/product/image-upload',

    // REVIEW
    USER_LIST_REVIEW: api_domain + '/reviews',
    GET_PRODUCT_REVIEW: api_domain + '/review/',
    CHANGE_REVIEW: api_domain + '/review/update/',
    STORE_REVIEW: api_domain + '/review/store/',
    DELETE_REVIEW: api_domain + '/review/delete',

    // RECOMMENDATION
    GET_RECOMMENDATION: api_domain + '/recommendation?category=',

    // ONBOARDING
    ONBOARDING: api_domain + '/onboarding?category=',

    // WISHLIST
    GET_WISHLIST: api_domain + '/wishlist?category=',
    ADD_TO_WISHLIST: api_domain + '/wishlist/store',
    DELETE_WISHLIST: api_domain + '/wishlist/delete',

    // EXPLORE
    EXPLORE: api_domain + '/explore',
    EXPLORE_CATEGORY: api_domain + '/explorecat?category=',

    // LIKE
    LIKE: api_domain + '/like',
    DISLIKE: api_domain + '/dislike',
    GET_LIKE: api_domain +'/likes/',

    // BRANDS
    GET_BRANDS: api_domain + '/brands',

    USER_PROFILE: api_domain + '/user/',
    USER_LIKES: api_domain + '/user/likes/',

    // RE-ORDERING
    RE_ORDERING: api_domain + '/reordering',

    // OAUTH LOGIN
    OAUTH_LOGIN: api_domain + '/oauth',
    OAUTH_FAST_LOGIN: api_domain + '/oauth/fast',
};
