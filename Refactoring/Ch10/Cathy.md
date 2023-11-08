## 챕터 10 조건부 로직 간소화

조건부 로직은 프로그램의 힘을 강화에 기여하지만, 복잡하게 하는 원흉이기도 함

### 조건문 분해하기
조건식과 조건식에 딸린 조건절 각가을 함수로 추출

```javascript
// Before
if (!aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd))
  charge = quantity * plan.summerRate;
else
  charge = quantity * plan.regularRate + plan.regularServiceCharge;

// After
if (summer())
  charge = summerCharge();
else
  charge = regularCharge();

function summer() {
  return !aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd);
}

function summerCharge() {
  return quantity * plan.summerRate;
}

function regularCharge() {
  return quantity * plan.regularRate + plan.regularServiceCharge;
}
```

### 조건식 통합하기
비교하는 조건은 다르지만 동작은 똑같은 경우 조건 검사도 하나로 통합이 좋다

```javascript
// Before
function disabilityAmount(anEmployee) {
  if (anEmployee.seniority < 2) return 0;
  if (anEmployee.monthsDisabled > 12) return 0;
  if (anEmployee.isPartTime) return 0;
}

// After
function disabilityAmount(anEmployee) {
  if (isNotEligibleForDisability()) return 0; // 결과값이 같은 조건식을 통합

  function isNotEligibleForDisability() {
    return ((anEmployee.seniority < 2) || (anEmployee.monthsDisabled > 12) || (anEmployee.isPartTime));
  }
}

```

### 중첩 조건문을 보호 구문으로 바꾸기
비정상 조건인 경우 함수를 종료하는 것을 보호 구문(guard clause)이라고 함
조건문의 결과에 따라 동작이 달라지는 경우, 조건문을 보호 구문으로 바꾸는 것이 좋다.
보호 구문으로 바꾸는 것의 핵심은 의도를 부각하는 것이다.

```javascript
// Before
function getPayAmount() {
  let result;
  if (isDead) result = deadAmount(); // 첫번째 보호 구문
  else {
    if (isSeparated) result = separatedAmount(); // 두번째 보호 구문
    else {
      if (isRetired) result = retiredAmount(); // 세번째 보호 구문
      else result = normalPayAmount(); // 결국엔 모든 조건이 맞으면 이것이 실행됨
    }
  }
  return result;
}

// After
function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

### 조건부 로직 다형성으로 바꾸기
복잡한 조건부 로직은 이해하기 어렵게 만든다.
조건부 로직을 클래스와 다형성을 이용하면 조건들을 더 확실하게 분리 할 수 있음 

> 제일 생각 못하는 부분. 예제 따라 한번 생각해보자

```javascript
// Before
function plumage(bird) {
  switch (bird.type) {
    case '유럽 제비':
      return '보통이다';
    case '아프리카 제비':
      return (bird.numberOfCoconuts > 2) ? '지쳤다' : '보통이다';
    case '노르웨이 파랑 앵무':
      return (bird.voltage > 100) ? '그을렸다' : '예쁘다';
    default:
      return '알 수 없다';
  }
}

// After
class EuropeanSwallow {
  get plumage() {
    return '보통이다';
  }
}

class AfricanSwallow {
  get plumage() {
    return (this.numberOfCoconuts > 2) ? '지쳤다' : '보통이다';
  }
}

class NorwegianBlueParrot {
  get plumage() {
    return (this.voltage > 100) ? '그을렸다' : '예쁘다';
  }
}

```

### 특이 케이스 추가하기
특이 케이스를 처리하는 코드가 복잡해지면 특이 케이스 자체를 클래스화 시키는 것이 좋다.
Null과 같은 특정값에 대해 동일한 반응들을 한데로 모으는게 효율적

> 실무에서 Null 값인 경우가 꽤 많은데 어떻게 적용 할 수 있을지 고민해보자


```javascript
// Before
if (aCustomer === '미확인 고객') customerName = '거주자';
else customerName = aCustomer.name;

// After
class UnknownCustomer {
  get name() { return '거주자'; }
}

const aCustomer = (customer === '미확인 고객') ? new UnknownCustomer() : customer;

```

### 어서션 추가하기
조건이 참이라고 가정하는 조건이 보이면, 그 조건을 추가하는 어서션을 건다.
특정 조건이 참일 때만 제대로 동작하는 코드 영역이 있는 경우에 적용

> 난 assert 을 사용한 적이 없음... 

```javascript
// Before
function applyDiscount(aCustomer, aPrice) {
  if (!aCustomer.discountRate) return aPrice;
  else return aPrice * (1 - aCustomer.discountRate);
}

// After
function applyDiscount(aCustomer, aPrice) {
  if (!aCustomer.discountRate) return aPrice;
  else {
    assert(aCustomer.discountRate >= 0);
    return aPrice * (1 - aCustomer.discountRate);
  }
}
```

### 제어 플래그 탈출문으로 바꾸기
제어플래그란, 코드의 동작을 변경하는 데 사용되는 변수
리팩터링으로 충분히 간소화할 수 있음에도 복잡하게 작성된 코드에서 흔히 나타난다. 

```javascript
// Before
function foundPerson(people) {
  for (let i = 0; i < people.length; i++) {
    if (people[i] === 'Don') {
      return 'Don';
    }
    if (people[i] === 'John') {
      return 'John';
    }
    if (people[i] === 'Kent') {
      return 'Kent';
    }
  }
  return '';
}

// After
function foundPerson(people) {
  const candidates = ['Don', 'John', 'Kent'];
  return people.find(p => candidates.includes(p)) || '';
}
```

