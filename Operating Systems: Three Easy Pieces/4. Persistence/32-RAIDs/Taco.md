우리가 디스크에게 바라는 것은 크게 세 가지다
1. 빠름
2. 큼
3. 믿을만함

RAID는 여러개의 disk를 모아서 이 요구사항을 이뤄줄 수 있다. 

외적으로는 그냥 디스크처럼 보인다: 내부적으로는 좀 복잡하다. 다양한 디스크와 메모리가 있고, 프로세서가 있다. 오히려 컴퓨터 시스템에 가깝다.
또 좋은 것은, 시스템에 있어서 투명성을 지니고 있어서, 호스트 시스템으로 하여금 이를 큰 디스크로 보게한다는 것이다. 그래서 많은 이들이 이를 쉽게 사용하게 하였다. 

## 1. Interface and RAID Internals
file msystem이 논리적 I/O 요청을 RAID에게 하면, 내부적으로 어떤 디스크에서 이를 접근해야할지 계산하고 한개 혹은 그 이상의 물리적 I/O를 발행한다. 
이 물리적 수준은 레이드 레벨에 달렸다. 

## 2. Fault Model
디스크 문제를 파악하고 회복하도록 설계되었다.
- fail-stop: disk는 일하거나 실패하거나의 상태를 가진다. 
  - 디스크가 실패하면 이는 쉽게 탐지된다는 가정이 있다. 

## 3. How to Evaluate a RAID
- 용량: N개의 디스크와 B개의 블록 -> N * B
- 신뢰성: 전체 디스크가 fail할 수 있는 것만 가정한다.
- 성능: 구하기 어렵다. 왜냐면 디스크 어레이에 있는 workload마다 다르기 때문이다. 

## 4. RAID Level 0: Striping
사실 전혀 RAID가 아니다: 중복이 없다. 그러나, 훌륭한 성능과 용량을 보여준다. 
- block을 라운드 로빈 방식으로 흩트려 놓는다: 같은 줄에 있는 블록들을 스트라이프라 불른다. 
  - 두개의 블록들을 다음 디스크로 가기전에 놓을 수도 있는데, 이 경우는 두개의 블록 사이즈 = 청크사이즈가 된다. 
  - 이 청크 사이즈는, 성능에 큰 영향을 미친다. 

### 청크 사이즈
- 작은 청크 사이즈는 한 파일에서의 병렬성을 높이지만 크기가 작기 때문에 찾는 시간이 걸린다. 
- 큰 청크 사이즈는 병렬성은 낮추지만, positioning time을 줄인다. 
- 대부분의 array들은 큰 청크 사이즈를 사용한다.

### Back To RAID-0 Analysis
- 용량: N*B 로 완벽
- 신뢰성: striping perfect but data 실패가 데이터 loss로 이어진다. 
- 성능: 훌륭. 모든 디스크가 병렬로 사용된다. 

### Evaluating RAID Performance
평가 기준은
1. single request latency: 병렬성이 얼마나 유지될 수 있는지
2. steady-state throughput: 동시 요청의 총 대역폭
   - throughput의 두 종류: sequential, random
   - sequential: 커다란 연속 청크 배열로 가정. 많은 환경에서 사용된다. 디스크에서 seek, wait for rotation 시간보다는, transfer하는 데 시간을 더 많이 사용한다. 
   - random: 데이터베이스에서 사용되는 작은, 서로 다른 위치에서의 요청. 대부분의 시간을 seeking and wating for rotation에 사용 
   - sequential이 같은 시간 내에 더 많은 throughput을 가진다.

### RAID-0 성능 분석
- latency: 거의 single disk와 다를바 없다.
- steady-state: 이 또한 디스크 수 N * S만큼 가능하다. 

## RAID Level 1: Mirroring
each block 마다 하나의 복제본 존재. 이를 통해 disk failures 를 이겨낼 수 있다. 
disk 4개가 있을 때 2개씩은 동일하다. 
- 읽을 때는, 동일한 것들 중 하나만 읽어도 관계가 없지만 write 시에는 모든 카피본을 업데이트 해야한다. 그리고 병렬로 이루어져야한다.

### RAID-1 Analysis
- capacity: 비싸다. N*B/2 (mirroring level = 2)
- reliability: well, no data loss
- performance: 
  - read: same as single disk but write: 병렬로 발생하기에 거의 single write과 비슷하지만, 물리적 write을 기다려야하므로 seek, rotational delay가 있어 조금 더 오래걸린다. 
  - steady-state throughput: sequential/random 간 차이가 있다. 
    - sequential: read, write 모두 N*s/2.
    - random: read N*S, write N*S/2

## RAID-4: Saving Space With Parity
parity라는, 디스크 중복 어레이를 추가해서 용량은 좀 적게 쓰더라도 mirrored system으로 인한 공간 손실을 막아보고자 한다. 
그러나 이는 성능을 좀 감소한다. 

- 각 스트라이프마다 패리티가 있다. 
- 이를 계산하려면 XOR로 가능하다. 홀수개로 1이 있으면 1, 아니면 0이다. 이를 통하여 한 컬럼의 데이터를 잃게되더라도 그 값이 1인지 0인지 파악이 가능하다. 

### RAID-4 Analysis
- capacity: (N-1)* B
- reliability: 1disk까지는 잃어도 된다.
- performance
  - throughput: 
    - sequential read: (N-1)* S
    - sequential write: (N-1)* S
    - random read: (N-1)* R
    - random write: 어느 하나를 바꾸면 패리티도 바꿔야하는데, 이 경우 다른 블락들을 가져와서 계산을 다시 하는 방법이 있고, 아니면 서로의 bit을 바꾸는 substractive method로 진행한다. 
      - 두번째 방법의 경우, 한번의 write으로 4개의 물리적 I/O가 일어난다. 
      - 그러나 만약 두개의 random write이 동시에 일어난다면? parity write의 경우, 패리티 값이 디스크 하나에 집중되어 있기 때문에 병렬성이 일어나기 어렵다. 
      - 그 이유는 모든 read가 끝난 뒤 write이 이루어져야하기 때문이다. 따라서 R/2의 스루풋이 가능하다.

## RAID Level 5: Rotating Parity
random write 문제를 해결하기위하여, 패리티를 디스크마다 하나씩 둔다. 

### RAID-5 Analysis
- capacity, reliability는 레이드 4와 동일하다. 
- 성능의 경우에도 순차 읽기 쓰기는 같다. 
- Random read의 경우 우리는 모든 디스크를 사용할 수 있기 때문에, 조금 더 나아지고, 
- random write의 경우는 병렬성이 가능해진다. N/4*R
- RAID-4의 단점을 보완했기 때문에, 시장에서 그를 대체했다. 

## RAID Comparison
- 성능이 제일 중요하다면 striping! 
- random I/O + 신뢰성이 중요하다면 미러링
- 용량과 신뢰성이 중요하면 RAID-5
- 순차 I/O와 용량이 제일 중요하면 RAID-5

