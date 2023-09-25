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