function sampleProvinceData(){
    return {
        name: 'Asia',
        producers:[
            {name: "Byzantium", cost:10, production:9},
            {name: "Attalia", cost:12, production:10},
            {name: "Sinope", cost:10, production:6},
        ],
        demand: 30,
        price: 20
    }
}
class Province {
    constructor(doc){
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = 0;
        doc.producers.forEach(d => this.addProducers(this.d));
    }

    addProducers(arg){
        this._producers.push(arg);
        this._totalProduction += arg.production;
    }
    get producers(){
        return this._producers.slice();
    }
    get name(){
        return this._name;
    }
    get totalProduction(){
        return this._totalProduction;
    }
    get demand(){
        return this._demand;
    }
    get price(){
        return this._price;
    }
    
    set totalProduction(arg){
        this._totalProduction = arg;
    }
    set demand(arg){
        this._demand = parseInt(arg);
    }
    set price(arg){
        this._price = parseInt(arg);
    }
    get shortfall(){
        return this._demand - this._totalProduction;
    }
    get profit (){
        return this.demandValue - this.demandCost;
    }
    get demandValue(){
        return this.satisfiedDemand * this.price;
    }
    get satisfiedDemand(){
        return Math.min(this._demand, this.totalProduction);
    }
    get demandCost(){
        let remainingDemand = this.demand;
        let result = 0;
        this.producers.sort((a,b) => a.cost - b.cost).forEach(p => {
            const contribution = Math.min(remainingDemand - p.production);
            remainingDemand -= contribution;
            result += contribution * p.cost;
        })
        return result;
    }
}

class Producer {
    constructor(aProvince, data){
        this._province = aProvince;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production || 0;
    }
    get name(){
        return this._name;
    }
    get cost(){
        return this._cost;
    }
    get production(){
        return this._production;
    }
    
    set cost(arg){
        this._cost = parseInt(arg);
    }
    set production(amountStr){
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0: amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }
}

describe('province', function(){
    it('shortfall', function(){
        const asia = new Province(sampleProvinceData()); // fixture 설정
        assert.equal(asia.shortfall, 5); // 검증
    })
})

describe('province', function(){
    let asia;
    beforeEach(function(){
        asia = new Province(sampleProvinceData());
    })
    it('shortfall', function(){
        expect(asia.shortfall).equal(5);
    })
    it('profit', function(){
        expect(asia.profit).equal(230);
    })
    it('change production', function(){
        asia.producers[0].production = 20;
        expect(asia.shortfall).equal(-6);
        expect(asia.profit).equal(292);
    })
    it('zero demand', function(){
        asia.demand = 0;
        expect(asia.shortfall).equal(-25);
        expect(asia.profit).equal(0);
    })
    it('negative demand', function(){
        asia.demand = -1;
        expect(asia.shortfall).equal(-26);
        expect(asia.profit).equal(-10);
    })
    it('empty string demand', function(){
        asia.demand = "";
        expect(asia.shortfall).NaN;
        expect(asia.profit).NaN;
    })
})

describe('no producers', function(){
    let noProducers;
    beforeEach(function(){
        const data = {
            name: "No producers",
            producers: [],
            demand: 30,
            price: 20
        };
        noProducers = new Province(data);
    });
    if('shortfall', function(){
        expect(noProducers.shortfall).equal(30);
    });
    it('profit', function(){
        expect(noProducers.profit).equal(0);
    })
})

describe('string for producers', function(){
    it('', function(){
        const data = {
            name: "String producers", 
            producers: "",
            demand: 30,
            price: 20
        };
        const prov = new Province(data);
        expect(prov.shortfall).equal(0);
    })
})