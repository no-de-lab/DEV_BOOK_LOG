요청이나 데이터를 균등하게 서버에 분배해야한다. 그렇게 하기 위해서는 해시 기술이 필요하다. 

그러나 이 해시 기술은 풀어야할 문제들이 있다. 

## 1. 해시 키 재배치 문제
N개의 해시 서버가 있다는 가정을 할 때, 제일 일반적으로는 hash(key) % N이다. 
그러나, 이 방법은 서버 풀의 크기가 고정되어있을 때 좋은 방법이다. 서버가 추가되거나 기존 서버가 삭제되면 문제가 생긴다. 서버 수가 달라지므로 키가 재분배된다. 그 결과로, 대규모 캐시 미스가 발생한다. 

## 2. 안정해시
안정해시는 이 문제를 해결한다. 

해시 테이블의 크기가 조정될 때, 전통적 해시 테이블은 거의 대부분 키를 재배치 한다고 한다면, 안정 해시는 키 개수 / 슬롯 개수만큼만 재배치한다. 

이는 해시 링이라는 개념으로 해결한다. 임의의 해시 함수를 사용한다고 하고, 해시 공간이 n 정도 된다고 가정했을 때, 이 해시 공간의 양쪽을 구부려 접어 해시 링을 만들어낸다. 

캐시할 키를 해당 링 위의 어느 지점에 배치한다. 어떤 키가 저장될 서버는, 해당 키의 위치로부터 시계방향으로 링을 탐색하며 만나는 첫 서버다. 

이때는 서버를 추가하더라도, 키 가운데 일부만 재배치하면 된다. 

그런데 이 접근법에는 두가지 문제가 있다.
1. 서버가 추가 혹은 삭제될 때 파티션의 크기를 균등히 유지하기가 불가능하다. (파티션 = 인접산 서버 사이의 해시 공간)
2. 키의 균등분포를 달성하기가 어렵다. 

## 3. 가상노드 도입
실제 노드나 서버를 가리키는 노드다. 하나의 서버는 링 위에 여러 가상 노드를 가질 수 있다.
따라서 각 서버는 하나가 아닌 여러 파티션을 관리해야한다. 

키의 위치로부터 시계방향으로 링을 탐색하다 만나는 최초의 가상 노드가 해당 키가 실제로 저장될 서버가된다. 
이 가상 노드 수를 늘리면 키의 분포는 더 균등해진다. 그러나 가상 노드 데이터를 저장할 공간은 더 많아질 것이라, 타협적 결정이 필요하다. 

### 가상노드에서의 재배치
서버가 추가되거나 삭제되면 해당 서버와 반시계방향의 첫 서버 사이의 키가 재배치가 되어야한다.

### 사용례
- 아마존 다이나모 데이터베이스
- 아파치 카산드라
- 디스코드 채팅 어플리케이션
등