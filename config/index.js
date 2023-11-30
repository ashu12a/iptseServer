const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8010;
const DBURL = process.env.DBURL || 'mongodb+srv://ashu:ashu1234@test.o0tuspf.mongodb.net/?retryWrites=true&w=majority';
const Access_Token_Secret = process.env.Access_Token_Secret || 'f4ff07e37340cf50a9f262d74cb720bdbd9eac2fd83c3a19487edf7915bd1e3242ead69d9ed4d405e459b2d24faad4d20bb95dd65c3fdbe243871b6560752db9';
const Refresh_Token_Secret = process.env.Refresh_Token_Secret || 'bae73ca87dacd16a9e09c5649a2de74aca3b081215937665a4fc0fe2fcd22c58a8855d533be2455a57b9811f845ff932f98802ca41b06f24549c77423176c5d0';


module.exports = {
    PORT,
    DBURL,
    Access_Token_Secret,
    Refresh_Token_Secret
}
