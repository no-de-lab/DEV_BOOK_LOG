## 캡슐화하기
모듈을 분리할 때, 그 기준은 각 모듈이 다른 모듈에 드러내지 않아야할 변수나 메서드를 얼마나 잘 숨기느냐에 있다. 
레코드를 캡슐화하거나, 컬렉션을 캡슐화하는 것이 그 방법이다. 

### 1. 레코드 캡슐화하기
```javascript
organization = {name: 'a', country: 'GB'}
// 아래의 방식으로 캡슐화
class Organization {
    constructor(data){
        this._name = data.name;
        this._country = data.country
    }
    get name(){return this._name}
    set name(arg){this._name = arg}
    get country(){return this._country}
    set country(arg){this._country = arg}
}
```
이름을 바꾸거나 데이터가 바뀔 때, 객체를 사용하면 좋다. 내용을 조작하는 방식을 통제하기 쉬워진다.

1. 레코드를 담은 변수를 캡슐화한다.
2. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다.
3. 테스트한다.
4. 원본 레코드 대신 새로 정의한 클래스타입의 객체를 반환하는 함수들을 새로 만든다. 
5. 새함수를 사용하도록 예전함수에서 고친다.