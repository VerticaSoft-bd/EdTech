
const mongoose = require('mongoose');

const DATABASE_URL = "mongodb://127.0.0.1:27017/ed-tech";

const HeroSlideSchema = new mongoose.Schema({
    tag: String,
    title: String,
    highlight: String,
    description: String,
    primaryBtn: String,
    secondaryBtn: String,
    image: String,
    color: String,
    order: Number,
    isActive: Boolean,
});

const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);

async function run() {
    try {
        await mongoose.connect(DATABASE_URL);
        const slides = await HeroSlide.find({}).sort({ order: 1 });
        console.log(JSON.stringify(slides, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
