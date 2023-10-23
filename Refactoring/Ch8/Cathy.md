## 챕터8 기능 이동

### 함수 옮기기
좋은 소프트웨어 설계의 핵심은 모듈화가 얼마나 잘 되어 있느냐!
잘 구축된 모듈성은 수정하려는 기능과 관련된 작은 일부만 이해해도 전체를 이해시킬 수 있는 능력이 있다.
이러한 모듈성을 위해, 서로 연관된 요소들을 묶고 요소 사이의 연결 관계를 쉽게 찾고 이해할 수 있도록 함수 옮기기 리팩터링이 필요하다.

_절차_
1. 선택한 함수가 현재 컨텍스트에서 사용 중인 모든 프로그램 요소를 살펴본다. 이 요소들 중에도 함께 옮겨야 할 게 있는지 고민
2. 선택한 함수가 다형 메서드인지 확인
3. 선택한 함수를 타겟 컨텍스트로 복사, 이 함수가 새로운 곳에 맞도록 코드를 다듬는다.
  - 타켓함수: 원래 함수(소스 함수)를 복사하여 생성한 함수를 칭함
  ```javascript
    function trackSummary(points) {
      function calculateDistance() { ... }
    }

    // points를 매개변수로 전달
    function trackSummary(points) {}
    function calculateDistance(points) { ... }
  ```
4. 정적 분석 수행
5. 소스 컨텍스트에서 타켓 함수를 참조할 방법을 찾아 반영번영
6. 소스 함수를 타켓함수의 위임 함수가 되도록 수정
   ```javascript
    function trackSummary(points) {
      return {
        time: totalTime,
        distance: calculateDistance(points), // 타겟함수 참조
        pace
      }
    }
  ```
7. 테스트
8. 소스 함수를 인라인 할지 고민

```javascript
// Before trackSummary 에 있는 중첩 함수들
function trackSummary(points) {
  const totalTime = calculateTime()
  const totalDistance = calculateDistance()
  const pace = totalTime / 60 / totalDistance
  return {
    time: totalTime,
    distance: totalDistance,
    pace
  }
  function calculateDistance() { ... }
  function distance(p1, p2) { ... }
  function radians(degrees) { ... }
  function calculateTime() { ... }
}

// After
function trackSummary(points) {
  const totalTime = calculateTime()
  const pace = totalTime / 60 / totalDistance
  return {
    time: totalTime,
    distance: calculateDistance(points),
    pace
  }
}

function calculateDistance(points /* 매개변수로 넘겨 의존성 제거 */) { ... } // 중첩 함수를 독립적으로 사용하기 위해, 최상위로 옮김
function distance(p1, p2) { ... } // 의존성이 없기에 최상위로 옮김
function radians(degrees) { ... } // 의존성이 없기에 최상위로 옮김

```

### 필드 옮기기
프로그램의 진짜 힘은 데이터 구조에서 나옴, 적절치 않으면 곧바로 수정해야함.
한 레코드를 변경하려 할 때 다른 레코드의 필드까지 변경해야만 한다면 필드의 위치가 잘못되었다는 신호

_절차_
1. 소스 필드가 캡슐화되어 있지 않다면 캡슐화
2. 테스트
3. 타겟 객체에 필드 생성
4. 정적 검사
5. 소스 객체에서 타켓 객체를 참조할 수 있는지 확인
6. 접근자들이 타켓 필드를 사용하도록 수정
7. 테스트
8. 소스필드 제거
9. 테스트

```javascript

// Before
// discountRate 는 CustomerContract에 더 적합한 데이터이기 때문에 Customer에서 제거
class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._discountRate = discountRate
    this._contract = new CustomerContract(dateToday())
  }

  get discountRate () { return this._discountRate }
}

class CustomerContract {
  constructor(startDate) {
    this._startDate = startDate
  }
}

// After

class Customer {
  constructor(name, discountRate) {
    this._name = name;
    // contract 데이터 구조체 생성
    this._contract = new CustomerContract(dateToday())
    this._setDiscountRate(discountRate)
  }

  get discountRate () { return this._contract.discountRate }
  // contract 구조체의 discount Rate 업데이트
  _setDiscountRate (rate) { this._contract.discountRate = rate }
}

class CustomerContract {
  constructor(startDate, discountRate) {
    this._startDate = startDate
    // Customer 에 있던 discountRate를 CustomerContract에 선언
    this._discountRate = discountRate
  }

  get discountRate () { return this._discountRate }
  set discountRate (rate) { this._discountRate = rate }
}
```

### 문장(Statements)을 함수로 옮기기
중복 코드를 건강하게 관리하는 가장 효과적인 방법,
반복되는 부분을 피호출 함수로 합친다. ( 버그가 있으면 피호출만 수정 )

_절차_
1. 반복 코드가 함수 호출 부분과 멀리 떨어져 있다면 문장 슬라이스하기를 적용해 근처로 옮긴다.
2. 타깃 함수를 호출하는 곳이 한 곳뿐이면, 단순히 소스 위치에서 해당 코드를 잘라내어 피호출 함수로 복사하고 테스트한다. 이 경우하면 나머지 단계는 무시한다.
3. 호출자가 둘 이상이면 호출자 중 하나에서 타깃 함수 호출 부분과 그 함수로 옮기려는 문장등을 함께 다른 함수로 추출한다. 추출한 함수에 기억하기 쉬운 임시 이름을 지어준다.
4. 다른 호출자 모두가 방금 추출한 함수를 사용하도록 수정한다. 하나씩 수정할 때마다 테스트한다.
5. 모든 호출자가 새로운 함수를 사용하게 되면 원래 함수를 새로운 함수 안으로 인라인한 후 원래 함수를 제거한다.
6. 새로운 함수의 이름을 원래 함수의 이름으로 바꿔준다.

```javascript
// Before
result.push(`<p>제목: ${person.photo.title}</p>`) // 중복되는 코드라인
result.concat(photoData(person.photo))

function photoData(aPhoto) {
  return [
  `<p>위치: ${aPhoto.location}</p>`,
  `<p>날짜: ${aPhoto.date.toDateString()}</p>`,
  `<p>태그: ${aPhoto.tag}</p>`,
  ]
}

// After
result.concat(photoData(person.photo))

function photoData(aPhoto) {
  return [
  `<p>제목: ${aPhoto.title}</p>`, // photoData(피함수) 로 옮김
  `<p>위치: ${aPhoto.location}</p>`,
  `<p>날짜: ${aPhoto.date.toDateString()}</p>`,
  `<p>태그: ${aPhoto.tag}</p>`,
  ]
}
```
### 문장을 호출한 곳으로 옮기기
`문장(Statements)을 함수로 옮기기` 와 반대
추상화의 경계가 항상 올바르게 선이 그어지는 것이 아니다, 어느새 둘 이상의 다른 일을 수행하도록 바뀔 수 있다.
때문에 응집도가 낮은 일을 함수에서 제거하고 문장을 호출한 곳으로 옮기는 리팩토링이 필요하다.


_절차_
1. 호출자가 한두 개뿐이고 피호출 함수가 단순하다면, 피호출 함수의 처음 혹은 마지막 줄들 을 잘라내어 호출자들로 복사.
  - 테스트만 통과하면 이번 리팩토링은 여기서 끝
2. (피호출 함수가) 복잡하다면, 이동하지 않길 원하는 모든 문장을 함수로 추출한 다음 검색하기 쉬운 임시 이름 지정.
3. 원래 함수를 인라인
4. 추출된 함수의 이름을 원래 함수의 이름으로 변경


```javascript
// Before
emitPhotoData(outStream, person.photo)

function emitPhotoData(outStream, photo) {
  outStream.write(`<p>제목: ${photo.title}</p>\n`)
  // 아래 라인이 emitPhotoData의 응집도가 떨어지는 것으로 가정
  outStream.write(`<p>위치: ${photo.location}</p>\n`)
}

// After
emitPhotoData(outStream, person.photo)
// emitPhotoData 함수에서 제거하고 emitPhotoData를 호출하는 곳으로 옮김
outStream.write(`<p>위치: ${person.photo.location}</p>\n`)

function emitPhotoData(outStream, photo) {
  outStream.write(`<p>제목: ${photo.title}</p>\n`)
}

```
### 인라인 코드를 함수 호출로 바꾸기
똑같은 코드를 반복하는 대신 함수 호출로 변경하는 방법

_절차_
1. 인라인 코드를 함수 호출로 대체

```javascript
// Before
let appliesToMass = false
for (const s of states) {
    if (s === 'MA') {
        appliesToMass = true
    }
}
// After
appliesToMass = states.includes('MA')
```
### 문장 슬라이드하기
서로 관련있는 코드가 흩어져있을 때, 한 곳으로 모으는 리팩터링 (응집도를 높이는)

_절차_
1. 코드조각을 어디로 모을 것인지 목표위치 찾음 (아래 사항이 통과하지 않는다면, 리팩토링 취소)
  - 코드 조각에서 참조하는 요소를 선언하는 문장 앞으로는 이동할 수 없다.
  - 코드 조각을 참조하는 요소의 뒤로는 이동할 수 없다.
  - 코드 조각에서 참조하는 요소를 수정하는 문장을 건너뛰어 이동할 수 없다.
  - 코드 조각이 수정하는 요소를 참조하는 요소를 건너뛰어 이동할 수 없다.
2. 코드조각 이동
3. 테스트

```javascript
// Before
const pricingPlan = retrievePricingPlan()
const order = retrieveOrder()
let charge
const chargePerUnit = pricingPlan.unit

// After
const pricingPlan = retrievePricingPlan()
const chargePerUnit = pricingPlan.unit // pricingPlan 선언 바로 아래로 이동
const order = retrieveOrder()
let charge
```

### 반복문 쪼개기
두 가지 일을 수행하는 반복문을 하나의 일만 하도록 각각의 반복문으로 쪼갠다.

_절차_
1. 기존 반복문을 복제
2. 반복문이 중복되어 생기는 부수효과를 파악 -> 제거
3. 테스트
4. 완료 후, 각 반복문을 함수로 추출할지 고민

```javascript
// Before
let averageAge = 0
let totalSalary = 0
for (const p of people) {
  // `averageAge`, `totalSalary` 을 계산하는 두 가지 일을 수행
  averageAge += p.age
  totalSalary += p.salary
}
averageAge = averageAge / people.length

// After
let totalSalary = 0
// `totalSalary` 만 수행
for (const p of people) {
  totalSalary += p.salary
}

let averageAge = 0
// `averageAge` 만 수행
for (const p of people) {
  averageAge += p.age
}
averageAge = averageAge / people.length
```

### 반복문을 파이프라인으로 바꾸기
컬렉션 파이프라인을 이용하면 처리 과정을 인력의 연산으로 표현 할 수 있다.(논리의 흐름을 쉽게 파악할 수 있다)

_절차_

1. 반복문에서 사용하는 컬렉션을 가리키는 변수 생성
2. 각각의 단위 행위를 적절한 컬렉션 파이프라인 연산으로 대체
3. 반복문의 모든 동작을 대체했다면 반복문 제거

```javascript
// Before
const names = []
for (const person of input) {
  if (person.job === 'programer') {
    names.push(person.name)
  }
}

// After
const names = input
  .filter((person) => person.job === 'programer')
  .map((person) => person.name)
```

### 죽은 코드 제거하기
사용하지 않는 코드는 제거, 나중에 다시 사용하게 된다면 버전 관리 시스템을 이용

