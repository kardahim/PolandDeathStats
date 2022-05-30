const deathCausesJSON = require('../static/json/death_causes.json')
const populationJSON = require('../static/json/population.json')
const { Region, DeathCause, Population, Death, Role } = require('../db/models')

module.exports = {
    fill: async (req, res) => {
        // sets
        const regions = new Set()
        const death_causes = new Set()
        const populations = new Set()
        const deaths = new Set()
        const roles = new Set()

        roles.add("user")
        roles.add("admin")

        // add to sets
        deathCausesJSON.forEach((value) => {
            regions.add(value.Nazwa)
            death_causes.add(value['Przyczyny zgonów'])

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

        // fill regions if empty
        let all = await Region.findAndCountAll()
        regions.forEach((value) => {
            if (all.count === 0) {
                const region = { 'name': value }
                Region.create(region)
            }
        })

        // fill deaths causes if empty
        all = await DeathCause.findAndCountAll()
        death_causes.forEach((value) => {
            if (all.count === 0) {
                const deathCause = { 'name': value }
                DeathCause.create(deathCause)
            }
        })

        // fill populations if empty
        all = await Population.findAndCountAll()
        console.log(populations)
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

        // fill roles causes if empty
        all = await Role.findAndCountAll()
        roles.forEach((value) => {
            if (all.count === 0) {
                const role = { 'name': value }
                Role.create(role)
            }
        })
        
        res.json("success")
    }
}