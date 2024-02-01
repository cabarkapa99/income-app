const mongoose = require('mongoose');

const prihodiSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    datum:{
        type:String,
        required: true,
        default: " ",
    },
    prihod:{
        type: String,
        required: true,
        default: " ",
    }

}, {collection: 'prihodi'})

const dodajPrihod = async function(data){
    const noviPrihod = new PrihodiModel();
    noviPrihod._id = new mongoose.Types.ObjectId();
    noviPrihod.datum = data.datum;
    noviPrihod.prihod = data.prihod;

    return await noviPrihod.save();
}

const dohvatiPrihode = async function(){
    const prihodi = await PrihodiModel.find({},{_id:0}).exec();
    if(prihodi.length === 0){
        return null;
    }else{
        return prihodi;
    }
}
const PrihodiModel = mongoose.model('Prihodi', prihodiSchema);

module.exports = {
    dodajPrihod,
    dohvatiPrihode,
}