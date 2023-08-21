// import Realm from 'realm';
// import RNFS from 'react-native-fs';
// var key = new Int8Array(64);

// class FoodDBSchema extends Realm.Object {}
// FoodDBSchema.schema = {
//     name: 'FoodDB',
//     primaryKey: 'id',
//     properties: {
//         id: 'int',
//         fa_name:  { type: 'string', indexed: true},
//         en_name:  { type: 'string?', indexed: true},
//         category: 'float?',
//         local_unit_1:  'string?',
//         change_rate_1: 'float?',
//         local_unit_2:  'string?',
//         change_rate_2: 'float?',
//         energy: 'float?',
//         protein: 'float?',
//         carb: 'float?',
//         fiber: 'float?',
//         fat: 'float?',
//         sugar: 'float?',
//         salt: 'float?'
//     }
// };

// export default new Realm({schema: [FoodDBSchema], path: RNFS.MainBundlePath+'/testt.realm', schemaVersion: 4});