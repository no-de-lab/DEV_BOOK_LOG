
<h1 style="color: #A9DFDA">기본적인 리팩터링</h1>

- 함수와 변수 추출하기
- 함수와 변수 인라인하기
- 함수와 변수 선언(이름) 바꾸기
- 매개변수 객체 만들기
- 여러 함수 클래스로 묶기
- 단계 쪼개기 등이 있다.

## 1. 함수 추출하기

```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();

    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
}
// 위에서 아래로 변경

function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();
    printDetails(outstanding);

    function printDetails(outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
}
```
코드 조각을 찾아서 무엇을 하는지 파악한 다음에, 독립된 함수로 추출하고 목적에 맞는 이름을 붙인다. 

독립된 함수로 추출하는 시점은 다양한데, 코드가 하는 일이 뭔지 알리는 반면 짧게 구현 코드를 작성하면 좋을 때다. 함수를 짧게 만든다고 성능이 나빠지는 것이 아니라, 캐싱하기가 더 쉬워져 컴파일러 최적화도 가능하다. 이를 위해서는 중요한 것이 함수명을 잘 짓는 것이다. 

### 절차
1. 목적에 맞게 이름 잘 짓기
2. 추출할 코드를 분리해서 새 함수에 붙여넣기
3. 원본함수의 지역 변수를 참조하거나, 추출한 함수의 유효 범위를 벗어나는 변수는 없는지 검사

### 예: 유효 범위 벗어나는 변수가 없을 때 :함수를 추출한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = 0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
    function printBanner(outstanding){
        console.log("**************");
        console.log("banner");
        console.log("**************");
        
    }
    function printDetails(outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
}
```


### 예: 지역 변수 사용할 때 :이를 매개 변수로 사용한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = 0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
    printDetails(invoice, outstanding)
    
}
function printDetails(invoice, outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
```

### 예: 지역 변수 값을 변경할 때 :함수를 추출한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();
    printDetails(invoice, outstanding)
    
}
function printDetails(invoice, outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
function calculateOutstanding(invoice){
    let outstanding=0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
}
```

---
## 2. 함수 인라인하기
명확하지 않게 추출되면 인라인 시킨다. 쓸데없는 간접호출을 줄인다.
```javascript
function getRating(driver){
    return moreThanFiveRateDelieveries(driver) ? 2: 1
}
function moreThanFiveRateDelieveries(driver){
    return (driver.numberOfLateDelieveries > 5);
}
// 위에서 아래로 변경
function getRating(driver){
    return (driver.numberOfLateDelieveries > 5) ? 2: 1
}

```
---
## 3. 변수 추출하기
반대는 변수를 인라인하는 것이다.
표현식이 너무나도 복잡해 이해하기가 어려울 때, 지역 변수를 활용해 관리가 쉽게 할 수 있다. 변수를 쪼개기 때문에 디버깅에 도움이 되는 것은 덤이다.

```javascript
function price(order){
    return order.quantity * order.itemPrice - 
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
// 위에서 우선 변수를 하나 정리한다
function price(order){
    const basePrice = order.quantity * order.itemPrice;
    const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    const shipping = Math.min(basePrice * 0.1, 100);
    return basePrice - quantityDiscount + shipping;
}

// class 문맥 안에서 처리하는 방법
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }
    get quantity(){
        return this._data.quantity;
    }
    get itemPrice(){
        return this._data.itemPrice;
    }
     get price(){
        return this.basePrice - this.quantityDiscount + this.shipping;
    }
    get basePrice() { return this.quantity * this.itemPrice;}
    get quantityDiscount() { return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;}
    get shipping() { return this.quantity * ordthiser.itemPrice * 0.1, 100;}
}

```
객체로 구성하면 특정 로직과 데이터를 외부와 공유시 공유할 정보를 설명하는 적당한 크기의 문맥이 되어준다.
---
## 4. 변수 인라인하기
변수는 함수 안에서 표현식을 가리키는 이름으로 쓰이는데 원래 표현식과 다를 바 없을 때도 있다. 또한 주변 코드를 리팩터링하는 데 방해가 되기도 하므로, 그때는 그 변수를 인라인하는 것이 좋다.
---
## 5. 함수 선언 바꾸기
함수의 이름이나 매개변수 모두 이름이 중요하다.
간단한 절차보다 마이그레이션 절차가 더 적절한 경우가 많다.
1. 함수 본문 전체를 새로운 함수로 추출한다. 
```javascript
function circum(radius){
    return circumference(radius);
}
function circumference(radius){
    return 2 * Math.PI* radius;
}
```

2. 옛 함수를 인라인한다. 
3. 새 함수의 선언문과 호출문에 원하는 매개변수를 추가한다.
---
## 6. 변수 캡슐화하기
데이터는 함수보다 다루기가 까다롭다. 함수의 이름을 바꾸거나 다른 모듈로 옮기는 건 어렵지않다. 그러나 데이터는 참조하는 모든 부분을 한 번에 바꿔야하기 때문에, 다루기가 어렵다. 마치 전역 데이터가 다루기 어려운 이유와 같다. 

그래서 접근할 수 있는 범위가 넓은 데이터를 옮길 때 먼저 그 데이터로의 접근을 독점하는 함수를 만들도록 캡슐화해야한다.
```javascript
let defaultOwner = {firstName: "마틴", lastName: "파울러"};
//아래와 같이 캡슐화
let defaultOwner = {firstName: "마틴", lastName: "파울러"};
export function defaultOwner(){return defaultOwnerData;}
export function serDefaultOwner(){defaultOwnerData = arg;}
```
데이터를 변경하고 사용하는 코드를 감시할 확실한 통로가 되기도 하기 때문에 로직을 쉽게 끼워넣을 수 있다. 

그런데 만약 데이터 내용 변경도 제어하고싶다면 그 값을 바꿀 수 없게 만든다. 

---
