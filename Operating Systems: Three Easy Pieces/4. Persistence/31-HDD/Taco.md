HDD는 영구 storage로서의 주된 형식이자, 파일 시스템 개발의 많은 부분이 연관되어 잇어서 이해해야한다.

그런데 어떻게 디스크에서 데이터를 store, access를 할까?

## The Interface
drive는 read, write가 가능한 많은 sector들을 포함한다. 
- 한번에 4kb를 읽고 쓸 수 있다. 
- 그러나, 업데이트할 때는 512B만 atomic하므로 잘못하면 write 가 잘 못 끝날 수도 있다. 
- 여러 가정들이 있긴 하지만 인터페이스 상에서 명확하지는 않다. 
  - 가까운 블록이 더 빨리 걸린다거나
  - 연속적인 접근이 랜덤 접근보다 빠르다는 것 등이 그것이다.

## Basic Geometry
- 플래터
  - 동그란 surface, 데이터가 저장되어있다. 전자적 변화를 적용한다. 
  - 디스크는 2개 이상의 플래터를 갖고있다. 
  - 전원이 꺼져도 bit를 저장할 수 있는 알루미늄과 자석으로 된 surface가 있다.
- spindle
  - 플래터를 도는 모터와 연결된 친구.
  - 회전 율은 RPM으로 측정된다. 
  - 보통 7200 - 15000
- track
  - 동그랗게 된 플래터 내 트랙. 데이터를 인코딩하는 곳이다. 
- head
  - 트랙을 돌며 데이터를 읽고 쓴다.
- arm
  - 헤드를 옮겨준다.

## A Simple Disk Drive
반시계 방향으로 도는 surface 위, 스핀들이 돌고있고 disk arm이 옮겨다니며 헤드를 옮겨준다.

### Single-track Latency: The Rotational Delay
- 섹터를 찾기위해 도는 것을 기다리는 시간. 

### Multiple Tracks: Seek Time
트랙이 여러개일 때, 섹터를 찾기위해서는 트랙도 찾아내야한다. 
그래서 트랙을 찾으러 다니는 시간을 seek time이라 한다.
- 가장 오래걸린다.
- acceleration, coasting, deceleration, settling 네개로 나뉘고 settling이 가장 중요하다. 드라이브가 맞는 트랙인지 확신해야한다. 

### Some other details
- skew
- cache
- outer track이 더 많은 섹터를 가지고 있다. 

## I/O Time: Doing The Math
- seek > rotational delay > transfer( 데이터 읽고 쓰는 시간 ) 모두를 합쳐 I/O 시간이라 한다.
- Rate of I/O는 트랜스퍼할 데이터 양 나누기 I/O 시간이다.
- 