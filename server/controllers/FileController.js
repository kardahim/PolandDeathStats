const deathCausesJSON = require('../static/json/death_causes.json')
const populationJSON = require('../static/json/population.json')
const bcrypt = require("bcrypt")
const { Region, DeathCause, Population, Death, Role, User_Role, User, sequelize } = require('../db/models')
var XMLTOJSON = require('xml-js');

const csv2json = (csv) => {

    var lines=csv.split("\n");
 
    var result = [];
  
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }
  
    return JSON.stringify(result);
}
// create default user_roles if the do not exist
const createBuiltInRoles = async () => {
    const admin_role = await Role.findOne({ where: { name: "admin" } });
    const user_role = await Role.findOne({ where: { name: "user" } });
    if(!user_role) {
        const role = { 'name': "user" }
        Role.create(role)
    }
    if(!admin_role) {
        const role = { 'name': "admin" }
        Role.create(role)
    }
}
// create default user accounts if the do not exist
const createBuiltInUsers = async () => {
    var adminAcc = await User.findOne({ where: { email: "admin" }, attributes: { exclude: ['password'] } });

    //create admin account (if id does not exists)
    if(!adminAcc) {
        let password = "admin"
        bcrypt.hash(password, 10).then((hash) => {
            User.create({
                firstname: "admin",
                lastname: "admin",
                email: "admin",
                password: hash
            })
            console.log("hashed")
        })
        setTimeout(async function() {
            let admin = await User.findOne({ where: { email: 'admin' } });
            console.log(admin)
            const admin_role = await Role.findOne({ where: { name: "admin" } });
            const user_role = await Role.findOne({ where: { name: "user" } });
            // give admin user privileges
            User_Role.create({
                RoleId: user_role.id,
                UserId: admin.id
            })
            // give admin admin privileges
            User_Role.create({
                RoleId: admin_role.id,
                UserId: admin.id
            })
        },1000)
    }
}

const fill = async () => {
    // sets for temporary data
    const regions = new Set()
    const death_causes = new Set()
    const populations = new Set()
    const deaths = new Set()

    regions.add("POLSKA")
    regions.add("DOLNOŚLĄSKIE")
    regions.add("KUJAWSKO-POMORSKIE")
    regions.add("LUBELSKIE")
    regions.add("LUBUSKIE")
    regions.add("ŁÓDZKIE")
    regions.add("MAŁOPOLSKIE")
    regions.add("MAZOWIECKIE")
    regions.add("OPOLSKIE")
    regions.add("PODKARPACKIE")
    regions.add("PODLASKIE")
    regions.add("POMORSKIE")
    regions.add("ŚLĄSKIE")
    regions.add("ŚWIĘTOKRZYSKIE")
    regions.add("WARMIŃSKO-MAZURSKIE")
    regions.add("WIELKOPOLSKIE")
    regions.add("ZACHODNIOPOMORSKIE")

    // add to sets
    deathCausesJSON.forEach((value) => {
        // regions.add(value.Nazwa)
        death_causes.add(value['Przyczyny zgonów'])

        let regionId
        switch (value.Nazwa) {
            case "POLSKA":
                regionId = 1
                break
            case "DOLNOŚLĄSKIE":
                regionId = 2
                break
            case "KUJAWSKO-POMORSKIE":
                regionId = 3
                break
            case "LUBELSKIE":
                regionId = 4
                break
            case "LUBUSKIE":
                regionId = 5
                break
            case "ŁÓDZKIE":
                regionId = 6
                break
            case "MAŁOPOLSKIE":
                regionId = 7
                break
            case "MAZOWIECKIE":
                regionId = 8
                break
            case "OPOLSKIE":
                regionId = 9
                break
            case "PODKARPACKIE":
                regionId = 10
                break
            case "PODLASKIE":
                regionId = 11
                break
            case "POMORSKIE":
                regionId = 12
                break
            case "ŚLĄSKIE":
                regionId = 13
                break
            case "ŚWIĘTOKRZYSKIE":
                regionId = 14
                break
            case "WARMIŃSKO-MAZURSKIE":
                regionId = 15
                break
            case "WIELKOPOLSKIE":
                regionId = 16
                break
            case "ZACHODNIOPOMORSKIE":
                regionId = 17
                break
        }

        let deathCauseId
        switch (value['Przyczyny zgonów']) {
            case 'razem':
                deathCauseId = 1
                break
            case 'niektóre choroby zakaźne i pasożytnicze ogółem':
                deathCauseId = 2
                break
            case 'niektóre choroby zakaźne i pasożytnicze - AIDS':
                deathCauseId = 3
                break
            case 'nowotwory złośliwe ogółem':
                deathCauseId = 4
                break
            case 'nowotwory ogółem':
                deathCauseId = 5
                break
            case 'nowotwór złośliwy żołądka, okrężnicy, odbytnicy, złącza jelit i odbytu':
                deathCauseId = 6
                break
            case 'nowotwór złośliwy tchawicy, oskrzela i płuca':
                deathCauseId = 7
                break
            case 'nowotwór złośliwy kobiecych piersi i szyjki macicy':
                deathCauseId = 8
                break
            case 'zaburzenia wydzielania wewnętrznego, stanu odżywiania i przemiany metabolicznej - cukrzyca':
                deathCauseId = 9
                break
            case 'zaburzenia psychiczne i zaburzenia zachowania':
                deathCauseId = 10
                break
            case 'choroby krwi i narządów krwiotwórczych oraz niektóre choroby przebiegające  z udziałem mechanizmów autoimmunologicznych':
                deathCauseId = 11
                break
            case 'zaburzenia wydzielania wewnętrznego, stanu odżywiania i przemiany metabolicznej ogółem':
                deathCauseId = 12
                break
            case 'choroby układu nerwowego i narządów zmysłów':
                deathCauseId = 13
                break
            case 'choroby układu krążenia ogółem':
                deathCauseId = 14
                break
            case 'choroby układu krążenia - choroba nadciśnieniowa':
                deathCauseId = 15
                break
            case 'choroby układu krążenia - choroba niedokrwienna serca':
                deathCauseId = 16
                break
            case 'choroby układu krążenia - choroby naczyń mózgowych':
                deathCauseId = 17
                break
            case 'choroby układu krążenia - miażdżyca':
                deathCauseId = 18
                break
            case 'choroby układu oddechowego ogółem':
                deathCauseId = 19
                break
            case 'choroby układu oddechowego - zapalenia płuc, zapalenia oskrzeli, rozedma i astma':
                deathCauseId = 20
                break
            case 'choroby układu trawiennego ogółem':
                deathCauseId = 21
                break
            case 'choroby układu trawiennego - choroba przewlekła wątroby i marskość wątroby':
                deathCauseId = 22
                break
            case 'choroby skóry i tkanki podskórnej':
                deathCauseId = 23
                break
            case 'choroby układu kostnostawowego, mięśniowego i tkanki łącznej':
                deathCauseId = 24
                break
            case 'choroby układu moczowo-płciowego':
                deathCauseId = 25
                break
            case 'ciąża, poród i połóg':
                deathCauseId = 26
                break
            case 'niektóre stany rozpoczynające się w okresie okołoporodowym':
                deathCauseId = 27
                break
            case 'wady rozwojowe wrodzone, zniekształcenia i aberracje chromosomowe':
                deathCauseId = 28
                break
            case 'objawy, cechy chorobowe oraz nieprawidłowe wyniki badań klinicznych, laboratoryjnych gdzie indziej niesklasyfikowane':
                deathCauseId = 29
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - ogółem':
                deathCauseId = 30
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - wypadki i nieszczęśliwe następstwa wypadków ogółem':
                deathCauseId = 31
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - wypadki i nieszczęśliwe następstwa wypadków - wypadki komunikacyjne ogółem':
                deathCauseId = 32
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - wypadki i nieszczęśliwe następstwa wypadków - wypadki komunikacyjne - wypadki w ruchu pojazdów silnikowych':
                deathCauseId = 33
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - wypadki i nieszczęśliwe następstwa wypadków - inne zewnętrzne przyczyny urazu wypadkowego':
                deathCauseId = 34
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - samobójstwo':
                deathCauseId = 35
                break
            case 'zewnętrzne przyczyny zachorowania i zgonu - zabójstwo':
                deathCauseId = 36
                break
            case 'brak przyczyny zgonu (opisu) w Karcie Statystycznej do Karty Zgonu':
                deathCauseId = 37
                break
            case 'COVID-19':
                deathCauseId = 38
                break
        }

        deaths.add({
            'year': value.Rok,
            'value': value.Wartosc === '-' ? 0 : value.Wartosc,
            'RegionId': regionId,
            'DeathCauseId': deathCauseId
        })
    })
    populationJSON.forEach((value) => {
        let regionId
        switch (value.Nazwa) {
            case "POLSKA":
                regionId = 1
                break
            case "DOLNOŚLĄSKIE":
                regionId = 2
                break
            case "LUBELSKIE":
                regionId = 3
                break
            case "KUJAWSKO-POMORSKIE":
                regionId = 4
                break
            case "LUBUSKIE":
                regionId = 5
                break
            case "ŁÓDZKIE":
                regionId = 6
                break
            case "PODKARPACKIE":
                regionId = 7
                break
            case "PODLASKIE":
                regionId = 8
                break
            case "MAŁOPOLSKIE":
                regionId = 9
                break
            case "MAZOWIECKIE":
                regionId = 10
                break
            case "POMORSKIE":
                regionId = 11
                break
            case "ŚLĄSKIE":
                regionId = 12
                break
            case "OPOLSKIE":
                regionId = 13
                break
            case "ŚWIĘTOKRZYSKIE":
                regionId = 14
                break
            case "WARMIŃSKO-MAZURSKIE":
                regionId = 15
                break
            case "WIELKOPOLSKIE":
                regionId = 16
                break
            case "ZACHODNIOPOMORSKIE":
                regionId = 17
                break
        }
        populations.add({
            "year": value.Rok,
            "value": value.Wartosc,
            "RegionId": regionId
        })
    })
    // fill Regions if empty
    let all = await Region.findAndCountAll()
    regions.forEach((value) => {
        if (all.count === 0) {
            const region = { 'id': value.id,'name': value }
            Region.create(region)
        }
    })
    // fill DeathCauses if empty
    all = await DeathCause.findAndCountAll()
    death_causes.forEach((value) => {
        if (all.count === 0) {
            const deathCause = { 'name': value }
            DeathCause.create(deathCause)
        }
    })
    // fill Populations if empty
    all = await Population.findAndCountAll()
    // console.log(populations)
    populations.forEach((value) => {
        if (all.count === 0) {
            const population = {
                'year': value.year,
                'value': value.value,
                'RegionId': value.RegionId
            }
            Population.create(population)
        }
    })
    // fill deaths if empty
    all = await Death.findAndCountAll()
    deaths.forEach((value) => {
        if (all.count === 0) {
            const death = {
                'year': value.year,
                'value': value.value,
                'RegionId': value.RegionId,
                'DeathCauseId': value.DeathCauseId
            }
            Death.create(death)
        }
    })
    // fill roles if empty
    all_roles = await Role.findAndCountAll()
    if (all_roles.count === 0) {
        createBuiltInRoles()
    }
    // recreate built in users if any of them doesn't exist
    createBuiltInUsers()
}

// partly clears database (Deaths,Regions, Populations, DeathCauses)
const clearDB = async () => {
    try {
        await sequelize.transaction(async (transaction) => {
            const options = { transaction };
            await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", options);
            await sequelize.query("TRUNCATE TABLE deathcauses", options);
            await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", options);
        });
    } catch (error) {
        console.log(error);
    }

    await Region.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null);
    await Region.truncate({cascase:true})
    await Region.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null);
    await Population.truncate({cascase:true})
    await Death.truncate({cascase:true})
}

module.exports = {
    // clears database and fills it with default data
    restoreDefaultData: async(req,res) => {
        await clearDB()              
        await fill()
        res.status(200).json({ message: "Operation successful." })
    },

    // clears database and fills it with data from received file
    import: async (req, res) => {
        if (req.file && req.file.size>0) {
            const file = req.file;
            // console.log(file)
            var data = file.buffer.toString('utf8'); 
            
            if(String(file.originalname).includes('.json') || String(file.originalname).includes('.xml') || String(file.originalname).includes('.csv')) {
                try{
                    // creating sets for keeping temporary objects
                    const regions = []
                    const death_causes = []
                    const populations = []
                    const deaths = []
        
                    if(String(file.originalname).includes('.json') || String(file.originalname).includes('.csv')) {
                        var jsonData = []
                        if(String(file.originalname).includes('.json')) {  // the file in in .json format
                            jsonData = JSON.parse(data)
                        }
                        else {  // the file in in .csv format
                            jsonData = JSON.parse(csv2json(data))
                        }
        
                        for(let i=0;i<jsonData.length;i++) {
                            if(!regions.some(e => e.name === jsonData[i].region))
                            {
                                regions.push({
                                    "id":regions.length+1,
                                    "name": jsonData[i].region
                                })
                            }
                            if(!death_causes.some(e => e.name === jsonData[i].deathCause)) {
                                death_causes.push({
                                    "id":death_causes.length+1,
                                    "name":jsonData[i].deathCause
                                })
                            }
                            if(!populations.some(e => e.value === jsonData[i].population)) {
                                populations.push({
                                    "year": jsonData[i].year,
                                    "value": jsonData[i].population,
                                    "RegionId": regions.find(elem => elem.name==jsonData[i].region).id
                                })
                            }
                            deaths.push({
                                'year': jsonData[i].year,
                                'value': jsonData[i].deaths,
                                'RegionId': regions.find(elem => elem.name==jsonData[i].region).id,
                                'DeathCauseId': death_causes.find(elem => elem.name==jsonData[i].deathCause).id
                            })
                        }
                    }
                    else if(String(file.originalname).includes('.xml')) {  // the file in in .xml format
                        var jsonData = XMLTOJSON.xml2json(data, {compact:true, spaces: 4})
                        jsonData = JSON.parse(jsonData)
        
                        for(let i=0;i<jsonData.root.year.length;i++) {
                            if(!regions.some(e => e.name === jsonData.root.region[i]._text))
                            {
                                regions.push({
                                    "id":regions.length+1,
                                    "name": jsonData.root.region[i]._text
                                })
                            }
                            if(!death_causes.some(e => e.name === jsonData.root.deathCause[i]._text)) {
                                death_causes.push({
                                    "id":death_causes.length+1,
                                    "name":jsonData.root.deathCause[i]._text
                                })
                            }
                            if(!populations.some(e => e.value === jsonData.root.population[i]._text)) {
                                populations.push({
                                    "year": jsonData.root.year[i]._text,
                                    "value": jsonData.root.population[i]._text,
                                    "RegionId": regions.find(elem => elem.name==jsonData.root.region[i]._text).id
                                })
                            }
                            deaths.push({
                                'year': jsonData.root.year[i]._text,
                                'value': jsonData.root.deaths[i]._text,
                                'RegionId': regions.find(elem => elem.name==jsonData.root.region[i]._text).id,
                                'DeathCauseId': death_causes.find(elem => elem.name==jsonData.root.deathCause[i]._text).id
                            })
                        }
                    }
        
                    clearDB()

                    // adding prepared data to db
                    setTimeout(async function () {
                        var all = await Region.findAndCountAll()
                        if (all.count === 0) {
                            regions.forEach((value) => {
                                const region = { 'id': value.id,'name': value.name }
                                Region.create(region)
                            })
                        }
                        // adding DeathCauses to db
                        all = await DeathCause.findAndCountAll()
                        if (all.count === 0) {
                            death_causes.forEach((value) => {
                                const deathCause = { 'id': value.id,'name': value.name }
                                DeathCause.create(deathCause)
                            })
                        }
                        // adding Deaths to db
                        all = await Death.findAndCountAll()
                        if (all.count === 0) {
                            deaths.forEach((value) => {
                                const death = {
                                    'year': value.year,
                                    'value': value.value,
                                    'RegionId': value.RegionId,
                                    'DeathCauseId': value.DeathCauseId
                                }
                                Death.create(death)
                            })
                        }
                        // adding Populations to db
                        all = await Population.findAndCountAll()
                        if (all.count === 0) {
                            populations.forEach((value) => {
                                const population = {
                                    'year': value.year,
                                    'value': value.value,
                                    'RegionId': value.RegionId,
                                }
                                Population.create(population)
                            })
                        }
                    },2000)
                    return res.status(200).json({
                        message:'Import successful'
                    })
                }
                catch (e){
                    return res.status(400).json({
                        message: 'Błąd przetwarzania pliku'
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: 'File format not supported'
                })
            }
        }
        return res.json("Import process finished")
    },

    // fills database with default data
    fill: async (req, res) => {
        fill()
        return res.json("success")
    }
}