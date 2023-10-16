## 챕터6 기본적인 리팩토링

### 함수 추출하기
코드조각을 찾아 무슨 일을 하는지 파악, 독립된 함수로 추출, 추출한 함수에 적절한 이름 부여

독립된 함수로 추출
함수의 길이, 재사용성의 기준으로 함수를 추출 할 수 있으나, `목적과 구현을 분리`하는 방식이 가장 합리적이다. 
코드를 보고 무슨일을 하는지 파악하는데 시간이 걸린다면, 그 부분을 함수로 추출하는 것이 좋다.

_리팩토링 절차_
- 함수를 새로 만들고 목적을 잘 드러내는 이름을 붙인다. -> 무엇을 하는지가 드러나야 함다.
- 추출할 코드를 원본 함수에서 복사하여 새 함수에 붙여넣는다.
- 추출한 코드 중 원본 함수의 지역 변수를 참조하거나 추출한 함수의 유효범위를 벗어나는 변수는 없는지 검사한다. 있다면 매개변수로 전달한다.
- 변수를 다 처리했다면 컴파일한다.
- 원본 함수에서 추출한 코드 부분을 새로 만든 함수를 호출하는 문장으로 바꾼다.
- 테스트한다.
- 다른 코드에 방금 추출한 것과 똑같거나 비슷한 코드가 없는지 살핀다. 있다면 방금 추출한 새 함수를 호출하도록 바꿀지 검토한다.

```javascript
function printOwing(invoice) {
  let outstanding = 0;
  // 미해결 채무(outstanding)를 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amount;
  }

  // 마감일(dueDate)을 기록한다.
  const today = Clock.today;
  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
}
```

```javascript
// 미해결 채무(outstanding) 계산 부분
for (const o of invoice.orders) {
  outstanding += o.amount;
}
// 미해결 채무(outstanding) 함수로 따로 추출
function calculateOutstanding(invoice) {
  let outstanding = 0;
  for (const o of invoice.orders) {
    outstanding += o.amount;
  }
  return outstanding;
}
// 새로 만든 함수 호출
const outstanding = calculateOutstanding(invoice);
```

### 함수 인라인하기
함수 본문이 이름만큼 명확한 경우, 함수를 제거하고 호출문을 함수 본문으로 교체(쓸데없는 간접호출은 거슬릴 뿐이다)
잘못 추출된 함수들도 다시 인라인 해야 한다.

_리팩토링 절차_
- 다형 메서드인지 확인한다
- 인라인할 함수를 호출하는 곳을 모두 찾는다
- 각 호출문을 함수 본문으로 교체한다.
- 하나씩 교체할 때마다 테스트한다.
- 함수 정의(선언)문을 삭제한다.

```javascript
function reportLines(aCustomer) {
  const lines = [];
  gatherCustomerData(lines, aCustomer);
  return lines;
}

function gatherCustomerData(out, aCustomer) {
  out.push(["name", aCustomer.name]);
  out.push(["location", aCustomer.location]);
}
```

```javascript
function reportLines(aCustomer) { // 함수 이름이 이미 명확하다~
  const lines = [];
  // gatherCustomerData(lines, aCustomer); // 함추를 제거하고 인라인
  lines.push(["name", aCustomer.name]);
  lines.push(["location", aCustomer.location]);
  return lines;
}
```

### 변수 추출하기
표현식이 너무 복잡해서 이해하기 어려울 때, 복잡한 부분을 새로운 변수에 대입하면 표현식의 목적이 더 잘 드러난다.

_리팩토링 절차_
- 추출하려는 표현식에 부작용은 없는지 확인한다.
- 불변 변수를 하나 선언하고 이름을 붙일 표현식의 복제본을 대입한다.
- 원본 표현식을 새로 만든 변수로 교체한다.
- 테스트한다.
- 표현식을 여러 곳에서 사용한다면 각각을 새로 만든 변수로 교체한다. 하나 교체할 때마다 테스트한다.

```javascript
function price(order) {
  // 가격(price) = 기본 가격 - 수량 할인 + 배송비
  return order.quantity * order.itemPrice - // -> 기본가격을 변수로 추출 적절한 이름을 붙인다.
    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + // -> 수량확인 변수로 추출
    Math.min(order.quantity * order.itemPrice * 0.1, 100) // -> 배송비 변수로 추출
}

function price(order) {
  // 적절한 변수명으로 표현식이 어떤값을 반환하는지 명확히 드러난다.
  const basePrice = order.quantity * order.itemPrice;
  const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
  const shipping = Math.min(order.quantity * order.itemPrice * 0.1, 100);
  return basePrice - quantityDiscount + shipping;
}

```

### 변수 인라인하기
변수 이름이 주변 코드보다 더 많은 정보를 제공할 땐, 그 변수를 제거하자.

_리팩토링 절차_
- 대입문의 우변(표현식)에서 문제가 없는지 확인
- 변수가 불변으로 선언되지 않았다면 불변으로 만든 후 테스트
- 이 변수를 가장 처음 사용하는 코드를 찾아서 대입문 우변의 코드로 변경
- 테스트
- 변수를 사용하는 부분을 모두 교체할 때까지 이 과정을 반복
- 변수 선언문과 대입문을 지움
- 테스트

```javascript
let basePrice = anOrder.basePrice;
return (basePrice > 1000);
// 위의 코드를 아래와 같이 변경
return anOrder.basePrice > 1000; // 변수 인라인
```

### 함수 선언 바꾸기
함수는 프로그램을 작은 부분으로 나누는 주요 수단이다. 함수 선언은 소프트웨어 시스템의 구성요소를 조립하는 연결부 역할을 한다.
연결부에서 가장 중요한 요소는 함수의 이름이다. 
함수의 매개변수도 마찬가지로 함수의 기능을 설명하는 중요한 역할을 한다.

함수의 이름을 변경하거나, 매개변수를 추가/제거/교체

_리팩토링 절차_
- 매개변수를 제거하려거든 함수 본문에서 제거할 매개변수를 참조하는 코드는 없는지 확인한다.
- 메서드 선언을 원하는 형태로 변경
- 기존 메서드 선언을 참조하는 부분을 모두 찾아서 바뀐 형태로 수정
- 테스트

_마이그레이션 절차_
- 이어지는 추출 단계를 수월하게 만들어야 한다면 함수의 본문을 적절히 리팩토링 
- 함수 본문을 새로운 함수로 추출
- 추출한 함수에 매개변수를 추가해야 한다면 간단한 `함수 선언 바꾸기_리팩토링 절차_`를 따라서 매개변수를 추가
- 테스트
- 기존 함수를 인라인
- 이름을 임시로 붙였다면 함수 선언 바꾸기를 한 번 더 적용해서 원래 이름으로 되돌림
- 테스트 
* 다형성을 구현한 클래스, 즉 상속 구조 속에 있는 클래스의 메서드를 변경할 댸는 다형 관계인 다른 클래스들에도 변경이 반영 되어야함

```javascript
// 1. 함수 추출
function inNewEngland(aCustomer) {
  const stateCode = aCustomer.address.state;
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode); // xxNewinEngland 함수 추출
}

function xxNewinEngland(stateCode) {
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
}
// ========== // 
// 2. 변수 인라인
function inNewEngland(aCustomer) {
  // const stateCode = aCustomer.address.state; // 변수 인라인
  return xxNewinEngland(aCustomer.address.state); 
}

// ========= //
// 3. 기존 함수 호출을 새 함수로 교체
const newEnglanders = someCustomers.filter(c => xxNewinEngland(c)); // 변수 인라인

// ========= //

// 4. 테스트 후, 기존 함수 제거하고, 새 함수 이름에 기존 함수 명으로 변경
const newEnglanders = someCustomers.filter(c => inNewEngland(c.address.state));
function inNewEngland(statusCode) {
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(statusCode);
}
```

### 변수 캡슐화하기
데이터가 사용되는 모든 곳에서 한 번에 변경을 해줘야 하기 때문에, 변수를 캡슐화하는 것은 중요하다.
변수를 캡슐화하면 변수의 값을 읽거나 변경하는 모든 코드를 캡슐화한 함수로 대체할 수 있다.
불변 데이터는 캡슐화할 이유가 적다.

_리팩토링 절차_
- 변수로의 접근과 갱신을 전담하는 캡슐화 함수들을 만든다.
- 정적 검사를 수행한다.
- 변수를 직접 참조하던 부분을 모두 적절한 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀 때마다 테스트한다.
- 변수의 접근 범위를 제한한다.
- 테스트한다.
- 변수 값이 레코드라면 레코드 캡슐화하기를 적용할지 고려한다.

```javascript
let defaultOwner = {firstName: "마틴", lastName: "파울러"};
// 아래와 같이 캡슐화
function getDefaultOwner() {return Object.assign({}, defaultOwner);} // getter 복제본 반환하도록
function setDefaultOwner(arg) {defaultOwner = arg;} //setter
```

### 변수 이름 바꾸기
변수의 존재 이유를 잘 드러내는 이름으로 바꾸자.

_리팩토링 절차_
- 폭넓게 쓰이는 변수라면 변수 캡슐화하기를 고려
- 이름을 바꿀 변수를 참조하는 곳을 모두 찾아서 하나씩 변경
- 테스트 

```javascript
let a = height * width; // 변수 이름이 a라는 것은 변수의 존재 이유를 드러내지 못한다.
let area = height * width; // 변수 이름을 area로 변경
```

### 매개변수 객체 만들기
데이터 항목 여러 개가 이 함수에서 뭉쳐다닐 땐, 데이터 뭉치를 객체로 바꾸자. 
데이터 사이의 관계가 명확해 진다.
담길 데이터에 공통으로 적용되는 동작이 발견되면 그 동작을 함수로 추출할 수도 있다.
새로운 추상 개념으로 격상이 되기도 한다. 

_리팩토링 절차_
- 적당한 데이터 구조가 아직 마련되어 있지 않다면 새로 만든다.
- 테스트
- 함수 선언 바꾸기로 새 데이터 구조를 매개변수로 추가한다.
- 테스트
- 함수 호출 시 새로운 데이터 구조 인스턴스를 넘기도록 수정, 하나씩 테스트
- 기존 매개변수를 사용하던 코드를 새 데이터 구조의 원소를 사용하도록 바꾼다.
- 기존 매개변수를 제거하고 테스트

```javascript
const station = {
  name: "ZB1",
  readings: [
    {temp: 47, time: "2016-11-10 09:10"},
    {temp: 53, time: "2016-11-10 09:20"},
    {temp: 58, time: "2016-11-10 09:30"},
    {temp: 53, time: "2016-11-10 09:40"},
    {temp: 51, time: "2016-11-10 09:50"},
  ]
}
function readingsOutsideRange(station, min, max) {
  return station.readings.filter(r => r.temp < min || r.temp > max);
}
// 아래와 같이 매개변수 객체로 변경

const operatingPlan = {
  temperatureFloor: 47,
  temperatureCeiling: 53,
}
class NumberRange { // 새로운 클래스로 추출
  constructor(min, max) {
    this._data = {min: min, max: max};
  }
  get min() {return this._data.min;}
  get max() {return this._data.max;}
}

const range = new NumberRange(operationPlan.temperatureFloor, operationPlan.temperatureCeiling);

function readingsOutsideRange(station, range) {
  return station.readings.filter(r => r.temp < range.min || r.temp > range.max);
}

```

### 여러 함수를 클래스로 묶기
데이터 뭉치를 하나의 객체 안에 담아서 관리하면 데이터와 함수가 자연스럽게 묶일 수 있다.

_리팩토링 절차_
- 함수들이 공유하는 공통 데이터 레코드를 캡슐화
- 공통 레코드를 사용하는 함수 각각을 새 클래스로 옯긴다.
- 데이터를 조작하는 로직들은 함수로 추출해서 새 클래스로 옮긴다.

```javascript
const reading = { customer: "ivan", quantity: 10, month: 5, year: 2017 };
function acquireReading() {return Object.assign({}, reading);}

//  client01.js
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity; // 공통 기본요금 계산공식
```

```javascript
//  client02.js
const aReading = acquireReading();
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity); // 공통 기본요금 계산공식 
const taxableCharge = Math.max(0, base - taxThreshold(aReading.year));
```

```javascript
// 레코드를 클래스로 변환하기 위해 레코드를 캡슐화

class Reading {
  constructor(data) {
    this._customer = data.customer;
    this._quantity = data.quantity;
    this._month = data.month;
    this._year = data.year;
  }
  get customer() {return this._customer;}
  get quantity() {return this._quantity;}
  get month() {return this._month;}
  get year() {return this._year;}

  get baseCharge() {
    return baseRate(this.month, this.year) * this.quantity; // 공통 기본요금 계산을 클래스로 옮김
  }
  get taxableCharge() {
    return Math.max(0, this.baseCharge - taxThreshold(this.year)); // tax 계산을 클래스로 옮김
  }
}

const rawReading = acquireReading();
const aReading = new Reading(rawReading); // 클래스로 변환
const taxableCharge = aReading.taxableCharge; // 클래스에서 계산된 taxableCharge 값 사용
```

### 여러 함수를 변환 함수로 묶기
데이터를 입력받아서 원하는 형태로 변환해 반환하는 함수가 (중복으로)여러 개 있을 땐, 변환 함수를 사용할 수 있다.
이 리팩토링 대신 여러 함수를 클래스로 묶기 방식으로 처리해도 된다. 
원본 데이터가 코드 안에서 갱신 될 때는 클래스로 묶는 편이 좋다.

여러 함수를 묶는 이유는 도출 로직이 중복되는 것을 피하기 위해서다.

_리팩토링 절차_
- 변환할 레코드를 입력받아서 값을 그대로 반환하는 함수를 만든다.
- 묶을 함수 중 함수 하나를 골라서 본문 코드를 변환 함수로 옮기고, 처리 결과를 레코드에 새 필드로 기록한다. 그 다음 클라이언트 코드가 이 필드를 사용하도록 수정한다
- 테스트
- 나머지 관련 함수도 위 과정에 따라 처리한다.

```javascript
const reading = { customer: "ivan", quantity: 10, month: 5, year: 2017 };
function acquireReading() {return Object.assign({}, reading);}

function calculateBaseCharge(aReading) {
  return baseRate(aReading.month, aReading.year) * aReading.quantity;
}



function enrichReading(original) { // 변환 함수
  const result = _.cloneDeep(original); // 원본 데이터를 복제
  result.baseCharge = calculateBaseCharge(result); // 가공되지 않는 측정값에 기본 소비량 정보 추가
  result.taxableCharge = Math.max(0, result.baseCharge - taxThreshold(result.year)); // 세금 계산 정보 추가
  return result;
}

const rawReading = acquireReading();
const aReading = enrichReading(rawReading); // 변환 함수 호출
const baseCharge = aReading.baseCharge; // 변환 함수에서 계산된 baseCharge 값 사용
const taxableCharge = aReading.taxableCharge; // 변환 함수에서 계산된 taxableCharge 값 사용
```

### 단계 쪼개기
복잡한 코드를 이해하기 쉽도록 단계를 나눠서 표현하자.

_리팩토링 절차_
- 두 번째 단계에 해당하는 코드를 독립 함수로 추출한다.
- 테스트
- 중간 데이터 구조를 만들어서 앞에서 추출한 함수의 인수로 추가
- 테스트
- 추출한 두 번째 단계 함수의 매개변수를 하나씩 검토, 첫 번째 단계에서 사용되는 것은 중간 데이터 구조로 옮긴다.
- 첫번째 단계 코드를 함수로 추출하면서 중간 데이터 구조를 반환하도록 만든다.


```javascript
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
  // 계산이 두 단계로 되는 부분 
  const shippingPerCase = (basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase; 
  const price = basePrice - discount + shippingCost; 
  return price;
}

//  배송비 계산 부분을 함수로 추출 
function applyShipping(basePrice, shippingMethod, quantity, discount) {
  const shippingPerCase = (basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  const price = basePrice - discount + shippingCost;
  return price;
}

// 첫번째와 두번째가 주고받을 중간 데이터 구조 생성
function priceOrder(product, quantity, shippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
  const priceData = { basePrice, quantity, discount } // 중간 데이터 구조 생성 
  const price = applyShipping(priceData, shippingMethod); // 배송비 계산 함수 호출
  return price;
}

// function applyShipping(basePrice, shippingMethod, quantity, discount) {
function applyShipping(priceData, shippingMethod) {
  const shippingPerCase = (priceData.basePrice > shippingMethod.discountThreshold) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
  const shippingCost = priceData.quantity * shippingPerCase;
  const price = priceData.basePrice - priceData.discount + shippingCost;
  return price;
}

// 첫번째 단계를 함수로 추출
function calculatePricingData(product, quantity) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
  return { basePrice, quantity, discount }; // 중간 데이터 구조 반환
}

function priceOrder(product, quantity, shippingMethod) {
  const priceData = calculatePricingData(product, quantity); // 첫번째 단계 함수 호출
  const price = applyShipping(priceData, shippingMethod);
  return price;
}
```
