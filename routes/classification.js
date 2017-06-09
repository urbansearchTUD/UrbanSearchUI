const config = require('../config')
const express = require('express')
const router = express.Router()

const test_doc = `
Nederlandse onderzoekers ontdekken vierde Alzheimer-gen
Gepubliceerd: 08 juni 2017 16:29
Laatste update: 08 juni 2017 16:42

Voor het eerst sinds bijna dertig jaar is er een gen vastgesteld dat betrokken is bij het ontstaan van een erfelijke vorm van de ziekte van Alzheimer. Het SORL1-gen is gevonden door onderzoekers van VUmc, Erasmus MC en de TU Delft.
In de jaren 90 werd al duidelijk dat een afwijking in een van drie genen (PSEN1, PSEN2 en APP) het ziektebeeld van familiaire alzheimer kan verklaren. Dat is een zeldzame vorm van de ziekte, waarbij de aandoening overerft van ouder op kind en al op jonge leeftijd tot dementie kan leiden.

Uit eerder wetenschappelijk onderzoek bleek al dat genetische afwijkingen in het SORL1-gen het risico op de ziekte van Alzheimer verhogen. Echter was het niet duidelijk welke afwijkingen in het gen gevaarlijk zijn en welke niet.

De onderzoekers van VUmc hebben in hun onderzoek niet gezocht naar afwijkingen in het gen binnen leden van families waarin erfelijke alzheimer voorkomt, maar bekeken dit van een groep van tweeduizend anonieme alzheimerpatiënten en ook van gezonde proefpersonen.

Sorteren
"Door de SORL1-afwijkingen te sorteren aan de hand van hun eigenschappen zagen we dat sommige afwijkingen in het SORL1-gen vrijwel zeker tot dementie leiden. Andere leiden tot een meer dan tienvoudige verhoging van het risico op dementie, en weer anderen bleken goedaardig", zegt hoofdonderzoeker dr. Henne Holstege.

De bevindingen werden bevestigd na onderzoek bij een tweede, onafhankelijke groep van drieduizend eveneens anonieme alzheimerpatiënten en ook gezonde proefpersonen. Hierdoor wordt het SORL1-gen nu bijgeschreven als vierde in de rij van oorzakelijke alzheimer-genen.

Dankzij de ontdekking kan in de toekomst bij meer alzheimer-patiënten nu een oorzaak worden gevonden voor de ziekte.

Bij veel families waarin de ziekte voorkomt, is er geen mutatie gevonden in de drie genen. De kans bestaat dat er bij hen wel sprake is van een mutatie in het SORL1-gen. In dat geval kan men zich over het gen laten voorlichten en eventueel hun keuzes over de toekomst hierop aanpassen.
`

router.get('/', (req, res) => {

    res.render('classify/classify', {
        categories: config.get('rel_categories'),
        document: test_doc
    })
})

module.exports = router
