사용자가 많이 늘게 되면, 서버 하나가 아니라 여러 서버를 두어야하는데 이 때 웹/모바일 트래픽 처리 용 레이어, 데이터베이스 레이어 두개로 나누어 독립적으로 확장해나가게된다. 

## 그 전에 데이터베이스 선택하기
관계형 db vs nosql 중 선택해야한다.

nosql의 경우 아래와 같은 상황일 때 선택하기 좋다.
- 아주 낮은 응답 지연시간
- 데이터가 비정형
- 데이터를 직렬화하거나 역직렬화 할 수 있음
- 아주 많은 데이터를 저장해야함


## 웹서버 레이어 확장
스케일업과 스케일 아웃 두 가지의 확장 프로세스가 있다. 

스케일업을 하면 단순하긴 하지만 확장에 한계가 있다. cpu, memory를 무한대로 증설할 수 없다. 더불어 자동복구 방안이나 다중화 방안을 제시하지 않아서, 장애가 발생하면 완전히 서비스가 중단된다. 따라서 대규모 어플리케이션 설계에는 스케일 아웃이 적절한 방법이다. 

로드밸런서로 부하를 분산시킨다. 
- 사용자가 로드밸런서의 공개 IP 주소로 접속한다. 로드밸런서가 웹 서버들로 요청을 분산시킨다. 이 때는 사설 IP 주소를 사용한다. 

이렇게 장애를 자동복구하지 못하는 문제를 해소한다. 

## 데이터베이스 확장
많은 데이터베이스 관리 시스템이 다중화를 지원한다. 

주로 master-slave 관계를 설정하고, 데이터 원본은 주 서버에, 사본은 부 서버에 저장하게 된다. 또한 쓰기 연산은 master에서만 지원한다. slave 서버는 읽기 전용인데, 대부분은 읽기 작업이다.

이렇게 다중화하게되면 아래와 같은 이점이 있다.
1. 더 나은 성능: 병렬로 처리 가능한 질의 수가 늘어난다.
2. 안정성: 서버 가운데 일부가 파괴되어도 데이터는 보존된다.
3. 가용성: 데이터를 여러 지역에 복제가 가능해서, 하나의 데이터 베이스 서버에 장애가 발생하더라도 다른 서버에 있는 데이터를 가져와 계속 서비스할 수 있게 된다.

만약 오류가 발생한다면 두 가지로 나눠볼 수 있다. 
1. 부 서버가 하나인데 다운된 경우: 한시적으로 모두 주 데이터베이스로 전달된다. 
2. 주 서버가 다운된 경우: 부 서버 중 하나가 주서버가 되고, 최신 상태가 아닐 경우 복구 스크립트 등을 돌려 업데이트한다. 

## 응답시간 개선
### 캐시 
캐시란, 값 비싼 연산 결과, 혹은 자주 참조되는 값을 메모리 안에 두고, 요청이 보다 빠르게 이뤄지게끔하는 저장소라고 할 수 있다.

데이터베이스보다 훨씬 빠르다. 별도의 캐시 계층을 두면 성능이 개선되고 데이터베이스의 부하를 줄일 수 있다.

요청을 받은 웹 서버는 캐시에 응답이 저장되어 있는지를 먼저 확인한다. 저장돼 있다면 해당 데이터를 반환하고, 없으면 데이터베이스 질의를 통해 데이터를 찾아 캐시에 저장한 뒤 클라이언트에 반환한다. 이를 읽기 주도형 캐시 전략이라 부른다. 

### 캐시 사용 유의점
- 데이터 갱신보다 참조가 빈번할 때 사용하면 좋다. 
- 만료 시간을 고려해야한다.
- 일관성: 데이터 저장소의 원본과 캐시 내의 사본을 같게 유지하는 것도 어렵다.
- 장애에 대처할 방법: 캐시 서버 한대만 두면 장애가 났을 때 시스템 동작이 어려워진다. 그래서 여러 지역에걸쳐 캐시 서버를 분산해야한다.
- 캐시 메모리를 너무 작게 유지하면 너무 자주 데이터를 방출해야한다. 
- 데이터를 방출할 정책: LRU, LFU, FIFO와 같은 전략들

### CDN
정적 컨텐츠를 전송하는 데 쓰인다. 이를 쓰게되면 웹서버가 더이상 정적 컨텐츠를 서비스할 필요가 없다.

어떤 사용자가 웹사이트를 방문할시 그 사용자에 가장 가까운 위치의 cdn 서버가 정적 컨텐츠를 전달하게 된다. 

### CDN 사용 유의점
- 비용
- 적절한 만료 시한 설정
- cdn 장애에 대한 대처 방안
- 콘텐츠 무효화 방법

## 웹 계층의 수평적 확장: 무상태 웹계층
상태 의존적인 아키텍처의 경우, 한 사용자는 무조건 특정 서버에 연결되어야한다.

무상태 아키텍처로 구성하게되면, 사용자로부터의 HTTP 요청을 어떤 웹서버로도 전달할 수 잇다. 
상태 정보가 필요할 경우 웹서버가 공유 저장소로부터 데이터를 가져온다. 

## 메시지 큐를 통한 시스템 독립적 확장
메시지의 무손실을 보장하고, 비동기 통신을 지원하는 메시지 큐는 서버간 결합을 느슨하게 만들어서 규모 확장성이 있는 안정적 애플리케이션을 구성하기 좋다. 

## 로그, 메트릭, 자동화 이용 
- 로그: 에러 로그를 트래킹
- 메트릭: 사업 현황에 대한 유용한 정보를 얻을 수 있다. 
- 자동화: 시스템이 크고 복잡해지면, CI 도구를 사용해 생산성을 향상시킬 수 있다. 

## 데이터베이스의 규모 확장
### 수직적 확장
- 고성능 자원 증설: 비용과 SPOF위험성이 증가한다.

### 수평적 확장
샤딩이라고도 부른다. 샤드로 불리는 작은 단위로 분할하는데, 이 샤드에는 데이터 중복이 없다.

다만 이를 분리할 때 분리하는 기준인 샤딩 키를 어떻게 정하는지가 중요하다. 

또한 시스템이 복잡해지고 풀어야할 문제도 많이 생길 수 있다. 
- 데이터의 재 샤딩: 데이터가 너무 많아져서 하나의 샤드로는 감당이 어렵거나, 샤드간 데이터 분포가 균등하지 못해 샤드 소진이 일어나면 데이터를 재배치해야한다.
- 유명인사 문제: 특정 샤드에 질의가 집중될 경우
- 조인과 반정규화: 일단 여러 샤드가 되고나면 데이터를 조인하기가 힘들어지기 때문에 이에 반정규화를 실시할 수도 있다.
