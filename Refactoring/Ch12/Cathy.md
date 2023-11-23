## 상속 다루기

### 메서드 올리기
중복코드 제거는 중요함 그러나 일반적으로 중복을 찾기가 그리 쉽지 않다.
적용 하기 쉬운 상황은 메서드들의 본문 코드가 똑같을 때, 해당 본문을 슈퍼 클래스에 올려 서브 클래스의 중복을 제거한다.

### 필드 올리기
서브 클래스에서 같은 필드가 중복된다면 슈퍼 클래스로 올린다.

### 생성자 본문 올리기
서브클래스 생성자에서 반복되는 코드가 있다면 슈퍼클래스에 추가하고 서브클래스는 공통코드에서 참조하는 값들을 모두 super()로 받는다.

### 메서드 내리기
### 필드 내리기
메서드 올리기, 필드 올리기와 반대
서브 클래스 하나에만 해당하는 코드가 슈퍼클래스 안에 있다면 서브클래스로 내린다.

### 타입 코드를 서브클래스로 바꾸기
비슷한 대상들을 특정 특성에 따라 구분해야 할 때 서브 클래스로 생성하여 조건에 따라 다르게 동작하는 다형성을 제공한다.

```javascript

// before
function createEmployee(name, type) {
  return new Employee(name, type)
}

// After
function createEmployee(name, type) {
  switch (type) {
    case "engineer" : return new Engineer(name);
    case "manager"  : return new Manager(name)
  }
}

```

### 서브클래스 제거하기
타입 코드를 서브클래스로 바꾸기 로직과 비슷한 방법
중복되는 서브클래스들을 부모로 통합
일종의 ‘과도한 프로그래밍 요소 사용 제거하기’에 가까운 목적이다.

```javascript
// before
class Person {
  get genderCode() {
    return "X"
  }
}

class Male extends Person {
  get genderCode() {
    return "M"
  }
}

class Female extends Person {
  get genderCode() {
    return "F"
  }
}

// After

class Person {
  constructor(name, genderCode) {
    this._genderCode = genderCode || 'X'
  }
  get genderCode() {
    return this._genderCode
  }
}

function createPerson(aRecord) {
  switch (aRecord.gender) {
    case 'M': return new Person(aRecord.name, 'M')
    case 'F': return new Person(aRecord.name, 'F')
    default: return new Person(aRecord.name)
  }
}
```

### 슈퍼클래스 추출하기
비슷한 일을 수행하는 두 클래스가 잇다면 상속 메커니즘을 활용하여 공통의 슈퍼클래스로 옮김

```javascript
// before
class Department {
  get totalCost() { // naming 만 다를 뿐 수정함
    return this.monthlyCost * 12
  }
  get name() {...}
  get headCount() {...}
}

class Employee {
  get annualCost() {
    return this.monthlyCost * 12
  }
  get name() {...}
  get id() {...}
}

// after

class Party {
  get annualCost() { // 메소드명 통합
    return this.monthlyCost * 12
  }
  get name() {...}
}

class Department extends Party {
  get headCount() {...}
}

class Employee extends Party {
  get id() {...}
}

```

### 계층 합치기
계층구조가 진화하면서 상속받는 부모와 비슷해져서 독립적으로 존재해야 할 이유가 사라진다면 그 둘을 합친다.

### 서브클래스를 위임으로 바꾸기 (서브클래스를 상태 패턴, 전략 패턴으로 대체)
상속은 단점이 있다
객체가 달라져야 하는 이유가 여러가지가 있어도 서브 클래스는 하나의 이유만 적용할 수 있다. 상속클래스는 관계를 긴밀하게 결합하기에 부모의 수정으로 자식의 기능을 해치기가 쉽기에 각별히 주의

위임은 상속의 문제를 해결해준다.
상속보다 결합도가 약하다.

상속보다는 컴포지션을 사용하라 -> 컴포지션은 사실상 위임과 같은말

(헷갈린다 다시 예제코드를 천천히 읽어보자)

### 슈퍼클래스를 위임으로 바꾸기
상속을 잘못 적용한 경우 사용한다. 상속은 자식이 부모의 기능을 모두 갖는다는 뜻이고 이것이 어울리지 않으면 수정이 필요 하다