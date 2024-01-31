const model = require('../models/prihodi');

const dodajPrihod = async function(req, res, next){
    try{
        await model.dodajPrihod(req.body);
        return res.status(200).send('OK');
    }catch(err){
        next(err)
    }
}
const dohvatiPrihode = async function(req, res, next){
    try{
        let prihodi = await model.dohvatiPrihode();
        return res.send(prihodi);
    }catch(err){
        next(err)
    }
}


module.exports = {
    dodajPrihod,
    dohvatiPrihode,
}