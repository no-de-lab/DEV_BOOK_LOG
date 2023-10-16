## 챕터7 캡슐화 

### 레코드 캡술화 
데이터 레코드는 정의하고 사용하기 간단하지만 계산해서 얻을 수 있는 값 (Computed Value)와 그렇지 않은 값을 명확히 구분해야 하는 단점이 있다.
따라서, 클래스로 레코드를 묶는다면 Class의 Getter를 통하여 값을 구분하는데 도움이 될 수 있다.

_절차_
1. 레코드를 담은 변수를 캡슐화한다.
2. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다. 이 클래스에 원본 레코드를 반환하는 접근자도 정의, 변수를 캡슐화하는 함수들이 이 접근자를 사용하도록 수정
3. 테스트한다.
4. 원본 레코드 대신 새로 정의한 클래스 타입의 객체를 반환하는 함수들을 새로 만든다. 
5. 레코드를 반환하는 예전 함수를 사용하는 코드를 4에서 만든 새 함수를 사용하도록 변경, 필드에 접근할 때는 새 클래스의 접근자를 사용하도록 한다. 하나씩 바꿀 때마다 테스트한다.
6. 클래스에서 원본 데이터를 반환하는 접근자와 원본 레코드를 반환하는 함수들을 제거한다.
7. 테스트한다.
8. 레코드의 필드도 데이터 구조인 중첩 구조라면 레코드 캡슐화하기와 컬렉션 캡슐화하기를 재귀적으로 적용한다.

```javascript
const orgaization = {name: "애크미 구스베리", country: "GB"};

// 캡슐화
class Organization {
    constructor(data){
      this._name = data.name;
      this._country = data.country;
    }
    get name(){return this._name;}
    set name(aString){this._name = aString;}
    get country(){return this._country;}
    set country(aCountryCode){this._country = aCountryCode;}
}

const orgaization = new Organization({name: "애크미 구스베리", country: "GB"});

```


### 컬렉션 캡슐화하기
필요한 인터페이스만 노출
무분별한 Getter/Setter 보다 Getter할 대상의 필요한 인터페이스(add, remove, etc.)만 노출

_절차_
1. 아직 컬렉션을 캡슐화하지 않았다면 변수 캡슐화부터
2. 컬렉션에 원소를 추가/제거하는 함수를 추가한다.
3. 정적 검사를 수행한다.
4. 컬렉션을 참조하는 부분을 모두 찾아서, 컬렉션의 변경자를 호출하는 코드가 모두 앞에서 추가한 추가/제거 함수를 호출 할 수 있도록 수정, 하나씩 수정할 때마다 테스트한다.
5. 컬렉션 게터를 수정해서 원본 내용을 수정할 수 없는 읽기전용 프락시나 복제본을 반환하게 한다
6. 테스트


제대로 된 캡슐화를 하려면 컬렉션을 감싸는 클래스를 정의하고, 
컬렉션을 감싸는 클래스에 원소를 추가/제거하는 함수를 정의해야 한다.
```javascript
class Person {
    constructor(name){
        this._name = name;
        this._courses = [];
    }
    get name(){return this._name;}
    get courses(){return this._courses.slice();} //slice()를 통해 복제본을 반환
    set courses(aList){this._courses = aList.slice();}
    addCourse(aCourse){ // 추가 함수
        this._courses.push(aCourse);
    }
    removeCourse(aCourse, fnIfAbsent = () => {throw new RangeError();}){ // 제거 함수
        const index = this._courses.indexOf(aCourse);
        if(index === -1) fnIfAbsent();
        else this._courses.splice(index, 1);
    }
}
```

### 기본형을 객체로 바꾸기
단순히 String이나 Number로 사용되던 특정 상태를 객체 변경
객체로 바꾸면 함수를 추가할 수 있으므로 상태 비교 등 객체 내부로 캡슐화 할 수 있다.

(굳이...? 예제가 간단해서 그런지 그렇게 와닿지 않음 )

_절차_
1. 단순한 값 클래스를 생성, 생성자는 기존 값을 인수로 받아 저장, 이 값을 반환하는 게터를 추가
2. 정적 검사
3. 값 클래스의 인스턴스를 새로 만들어서 필드에 저장하도록 세터를 수정, 이미 있다면 필드의 타입을 적절히 변경
4. 새로 만든 클래스의 게터를 호출한 결과를 반환하도록 게터를 수정
5. 테스트
6. 함수 이름을 바꾸면 원본 접근자의 동작을 더 잘 드러낼 수 있는지 검토

```javascript

// 클라이언트 에서 사용 수정 전
highPriorityCount = orders.filter(o => "high" === o.priority || "rush" === o.priority).length;

class Order {
    constructor(data){
        this._priority = data.priority;
    }
    get priorityString(){return this._priority.toString();}
    set priority(aString){this._priority = new Priority(aString);} 
}

class Priority { 
    constructor(value){ 
        this._value = value;
    }
    toString(){return this._value;} // 문자열로 반환하는 변환함수 구성
}

// 클라이언트 에서 사용 수정 후
highPriorityCount = orders.filter(o => "high" === o.priorityString || "rush" === o.priorityString).length;
```


### 임시 변수를 질의 함수로 바꾸기
비즈니스 로직에 있는 계산된 임시 변수를 제거
계산된 임시 변수는 함수로 캡슐화

_절차_
1. 변수가 사용되기 전에 값이 확실히 결정되는지, 변수를 사용할 때마다 계산 로직이 매번 다른 결과를 내지는 않는지 확인
2. 읽기전용으로 만들 수 있는 변수는 모두 읽기전용으로 선언
3. 테스트
4. 변수 대입문을 함수로 추출
5. 테스트
6. 변수 인라인하기로 임시 변수 제거

```javascript
class Order {
  constructor(quantity, item){
    this._quantity = quantity;
    this._item = item;
  }
  get price () {
    // 임시 변수 basePrice, discountLevel 를 질의 함수로 변경 

    // let basePrice = this._quantity * this._item.price; => 읽기 전용
    // const basePrice = this._quantity * this._item.price; => getter 로 추출
    // const basePrice = this.basePrice; => 변수 인라인 
    // let discountLevel = 0.98; =>  discountedPrice 추출
    // if(this.basePrice > 1000) discountLevel -= 0.03; 
    return this.basePrice * this.discountLevel; // 변수 인라인
  }

  get basePrice () {
    return this._quantity * this._item.price;
  }

  get discountLevel () {
    let discountLevel = 0.98;
    if(this.basePrice > 1000) discountLevel -= 0.03;
    return discountLevel
  }
}
```

### 클래스로 추출하기
클래스의 일부 데이터+로직을 별개의 클래스로 추출
데이터와 메서드를 따로 묶을 수 있는 경우
함께 변경되는 일이 많거나 서로 의존하는 데이터
제거해도 다른 필드나 메서드에 문제 없으면 분리 가능

_절차_
1. 클래스의 역할을 분리할 방법을 정한다.
2. 분리될 역할을 담당할 클래스를 새로 만든다. (원래 클래스에 남은 클래스 역할과 이름이 어울리지 않는다면 적절히 바꾼다.)
3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해둔다.
4. 분리될 역할에 필요한 필드들을 새 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
5. 메서드들도 새 클래스로 옮긴다. 이대 저수준 메서드, 즉 다른 메서드를 호출하지보다는 호출을 당하는 일이 많은 메서드부터 옮긴다. 하나씩 옮길 때마다 테스트한다.
6. 양쪽 클래스의 인터페이스를 살펴보면서 불필요한 메서드를 제거하고, 이름도 새로운 환경에 맞게 바꾼다.
7. 새 클래스를 외부로 노출할지 정한다. 노출하려거든 새 클래스에 참조를 값으로 바꾸기를 적용할지 고민해본다.

```javascript 
class Person {
  ...
  get officeAreaCode() {
    return this._officeAreaCode
  }
  get officeNumber() {
    return this._officeNumber
  }
}
// ====아래와 같이 변경 === //
class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber() // 전화번호 인스턴스 생성
  }
  get officeAreaCode() {
    return this._telephoneNumber.areaCode
  }
  set officeAreaCode(arg) {
    this._telephoneNumber.areaCode = arg
  }
  get officeNumber() {
   return this._telephoneNumber.number
  }
  set officeNumber(arg) {
    this._telephoneNumber.number = arg
  }
}

class TelephoneNumber { // 전화번호 관련 별도 클래스 추출
  get areaCode() {
    return this._areaCode
  }
  set areaCode(arg) {
    this._areaCode = arg
  }
  get number() {
    return this._number
  }
  set number(arg) {
    this._number = arg
  }
}
```

### 클래스 인라인하기
클래스 추출하기 반대 
- 제 역할을 못 해서 그대로 두면 안 되는 클래스가 대상
- 두 클래스의 기능을 지금과 다르게 배분하고 싶을 때에도 사용

_절차_
1. 소스 클래스의 각 public 메서드에 대응하는 메서스들을 타깃 클래스에 생성한다. 이 메서드들은 단순히 작업을 소스 클래스로 위임해야 한다.
2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀 때마다 테스트한다.
3. 소스 클래스의 메서드와 필드를 모두 타깃 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
4. 소스 클래스를 삭제하고 조의를 표한다.(ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ)

```javascript
class Shipment { 
  get trackingInfo() {
    return this._trackingInformation.display;
  }
  get trackingInformation() {return this._trackingInformation;}
  set trackingInformation(aTrackingInformation) {
    this._trackingInformation = aTrackingInformation;
  }
}

class TrackingInformation { // Shipment 클래스의 일부처럼 사용됨
  get shippingCompany() {return this._shippingCompany;}
  set shippingCompany(arg) {this._shippingCompany = arg;}
  get trackingNumber() {return this._trackingNumber;}
  set trackingNumber(arg) {this._trackingNumber = arg;}
  get display() {
    return `${this.shippingCompany}: ${this.trackingNumber}`;
  }
}

```
TrackingInformation 제 역할을 하지 못하기에 Shipment inline

```javascript
aShipment.trackingInformation.shippingCompany = request.vendor; // 변경 전


class Shipment { 
  get trackingInfo() {
    return `${this.shippingCompany}: ${this.trackingNumber}}`
  }
  get trackingInformation() {return this._trackingInformation;}
  set trackingInformation(aTrackingInformation) {
    this._trackingInformation = aTrackingInformation;
  }
  // get shippingCompany() {return this._trackingInformation.shippingCompany;}
  // set shippingCompany(arg) {this._trackingInformation.shippingCompany = arg;} 
  // 변경 후
  get shippingCompany() {return this._shippingCompany;}
  set shippingCompany(arg) {this._shippingCompany = arg;} 
}
// TrackingInformation class 삭제

aShipment.shippingCompany = request.vendor; // 변경 후
```


### 위임 숨기기
모듈화 설계를 제대로 하는 핵심은 캡슐화
클라이언트가 위임 객체의 존재를 몰라도 되도록 감춤

_절차_
1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버에 생성한다.
2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
3. 모두 수정했다면, 서버로부터 위임 객체를 얻는 접근자를 제거한다.
4. 테스트한다.

```javascript
class Person {
  constructor(name) {
    this._name = name
  }
  get name() {
    return this._name
  }
  // 부서 클래스 숨김
  // get department() {
  //   return this._department
  // }
  // set department(arg) {
  //   this._department = arg
  // }
  get manager() { // 위임 메서드 추가
    return this._department.manager
  }
}

class Department {
  get chargeCode() {
    return this._chargeCode
  }
  set chargeCode(arg) {
    this._chargeCode = arg
  }
  get manager() {
    return this._manager
  }
  set manager(arg) {
    this._manager = arg
  }
}

// manager = aPerson.department.manager
manager = aPerson.manager
```

### 중개자 제거하기
위임 숨기기 반대 
서버 클래스가 단순히 중개자 역할만 할 때 적용

_절차_
1. 위임 객체를 얻는 게터를 만든다.
2. 위임 메서드를 호출하는 클라이언트가 모두 이 게터를 거치도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
3. 모두 수정했다면 위임 메서드를 삭제한다

```javascript
const manager = aPerson.manager

class Person {
  // get manager() { -> 중개자 제거
  //   return this.department.manager
  // }
  get department() {
    return this._department
  }
}

const manager = aPerson.department.manager
```


### 알고리즘 교체하기
복잡한 기존 코드를 간명한 방식으로 수정 (보통 복잡한 계산식 수정)
목적을 달성하는 더 쉬운 코드가 있을 때
코드와 똑같은 기능을 제공하는 라이브러리가 있을 때
알고리즘을 살짝 다르게 동작하도록 바꾸고 싶을 때 등등

_절차_
1. 교체할 코드를 함수 하나에 모은다.
2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
3. 대체할 알고리즘을 준비한다.
4. 정적 검사를 수행한다.
5. 기존 알고리즘과 새 알고리즘의 결과를 비교하는 테스트를 수행한다. 두 결과가 같다면 리팩터링이 끝난다. 그렇지 않다면 기존 알고리즘을 참고해서 새 알고리즘을 테스트하고 디버깅한다.