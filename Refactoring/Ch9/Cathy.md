## 챕터9 데이터 조직화

데이터 구조는 프로그램에서 중요한 역할
But, 데이터들이 여러 서비스에서 무분별하게 참조된다면 혼란과 버그 생성

데이터 구조를 리팩토링 함에 따라, 구조로 인한 유지보수 비용 절약

### 변수 쪼개기
역할이 2개 이상인 변수가 있다면 쪼갠다. 

_절차_
1. 변수를 선언한 곳과 값을 처음 대입하는 곳에서 변수 이름 변경
2. 가능하면 불변으로 변경
3. 이 변수에 두번째로 값을 대입하는 곳 앞까지의 모든 참조를 새로운 변수 이름 변경
4. 두번째 대입시 변수를 원래 이름으로 다시 선언
5. 테스트
6. 반복

```javascript
// Before
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp);
```

```javascript
// After - temp 변수명 쪼갬
const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

### 필드 이름 바꾸기
필드 이름은 프로그램을 이해하는데 아주 큰 역할을 한다. 직관적인 네이밍 작업은 추후에 프로그램을 이해하는데 중요

```javascript
// Before
class Organization {
  ...
  get name() { return this._name; }
  ...
}
```

```javascript
// After
// name -> title
// 사실 예제가 그렇게 좋지는 않음
class Organization {
  ...
  get title() { return this._title; }
  ...
}
```

### 파생 벼수를 질의 함수로 바꾸기
파생변수의 의미가 매우 직관적이라 간단하게 사용되면 좋겠지만, 그것은 희망편....
파생변수는 다소 직관적이지 못한 흐름을 만든다. 불변함수로 변경하여 side effect 를 막자.

_절차_
1. 변수 값이 갱신되는 지점을 모두 찾기. 필요하면 변수 쪼개기 활용해 각 갱신 지점에서 변수를 분리
2. 해당 변수의 값을 계산해주는 함수 찾기.
3. 해당 변수가 사용되는 모든 곳에 Assert 를 추가, 계산결과가 변수의 값과 같은지 확인
4. 테스트
5. 변수를 읽는 코드를 모두 함수 호출로 대체
6. 테스트
7. 변수를 선언하고 갱신하는 코드를 죽은 코드 제거

```javascript
// Before
get production() { return this._production; }
applyAdjustment(anAdjustment) {
  this._adjustments.push(anAdjustment);
  this._production += anAdjustment.amount;
}
```

```javascript
// After
get production() {
  return this._adjustments.reduce((sum, a) => sum + a.amount, 0); 
}
// get calculatedProduction() { // production 으로 inline
//   return this._adjustments.reduce((sum, a) => sum + a.amount, 0); 
// }
applyAdjustment(anAdjustment) {
  this._adjustments.push(anAdjustment);
  // this._production += anAdjustment.amount; 데이터 중복임 이부분 리팩토링 
}
```

### 참조를 값으로 바꾸기

필드를 값으로 다룬다면 내부 객체의 클래스를 수정하여 값 객체(Value Object)로 만들 수 있다. 값 객체는 대체로 자유롭게 활용하기 좋은데, 특히 불변이기 때문

값 객체는 분산 시스템과 동시성 시스템에서 유용하다.
한편, 이러한 특성 때문에 특정 객체를 여러 객체에서 공유하고 한다면, 해당 리팩토링 방법을 고려해봐야함.
공유 객체의 값을 변경하면 다른 객체들도 영향을 받기 때문에, 이런 경우에는 참조로 바꾸는 것이 좋다.

### 값을 참조로 바꾸기
원본 객체를 갱신하면, 복제본도 찾아서 갱신해야함. 하나라도 놓치면 데이터 일관성이 꺠진다. 
이런 상황이라면 복제된 데이터들을 모두 참조로 변경하는 것이 좋다.

값을 참조로 바꾸면 엔티티 하나당 객체도 단 하나만 존재하게 됨
보통 이런 객체들은 모아놓고 크라인터들의 접근을 관리해주는 일종의 저장소가 필요함


### 매직 리터럴 바꾸기
일반적인 리터럴 값을 말함
리터럴은 코드의 의미를 설명하지 못함. 리터럴을 상수로 바꾸면 의미가 분명해짐

```javascript
// Before
function potentialEnergy(mass, height) {
  return mass * 9.81 * height;
}
```

```javascript
// After
const STANDARD_GRAVITY = 9.81; // 의미부여
function potentialEnergy(mass, height) {
  return mass * STANDARD_GRAVITY * height;
}
```