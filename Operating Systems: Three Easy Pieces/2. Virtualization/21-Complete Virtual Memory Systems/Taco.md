어떻게 완전한 VM 시스템을 만들어낼 수 있을까.

두 가지 시스템을 다뤄볼 수 있다. 
하나는 현대적 vm manager 중에 가장 초기 버전인 VAX/VMS OS다. 
다른 하나는 Linux다. 
## VAX/VMS
VAX 하드웨어가 효율적인 추상화를 해주어야함에도, 모든 것을 잘 하지는 않아서, VMS가 이를 보완하였다. 
### Memory Management Hardware
VAX는 세그멘테이션, 페이징의 하이브리드였다. 
근데 이 하드웨어 페이지는 너무 작았다. (512byte) 이러면 페이지 테이블 사이즈가 너무 커진다. 

그래서 VMS 디자이너들은, 페이지 테이블이 메모리를 너무 넘어서지 않도록 주의했다. 
- 유저 주소 공간을 두개로 나누어, 사용되지 않으면 페이지 테이블 공간이 많이 사용되지 않게 하였다.
  - base, bounds 레지스터 사용
- OS는 유저 테이블을 커널 가상 메모리에 넣어서, 그것이 늘리거나 줄이거나 스왑하게 하였다. 
  - 이는 address translation을 더 복잡하게 하였다. 
    - 복잡함은 TLB에 의해서 더 빨라졌다. 
### A Real Address Space
- page 0은 널 포인트를 위한 것.
- 커널은 각 주소 공간에 매핑된다. 
- protection bit 있어서 보안

### Page Replacement
VAX에 reference bit가 없고, memory를 많이 잡아먹는 프로그램이 있는데, LRU는 이를 잡아주지 못한다. 
- 그래서 segmented FIFO 교체 정책을 이용하여, 각 최대 페이지 개수를 놔두고 그것을 넘게되면 먼저 들어왔던 페이지는 제거된다
  - FIFO가 이상적이지는 않으므로, VMS는 second chance list를 이용해서, 완전히 페이지를 제거하지 않고 clean page free list, dirty page list 내에 페이지를 집어넣는다.
  - 만약 다른 프로세스가 어떤 페이지가 필요하면, 이 free list의 첫째 페ㅐ이지를 갖다쓴다.
- 페이지가 작으니 비효율적인 스왑이 일어난다는 점에서, 클러스터링을 도입. 한번에 변화를 디스크에 write 하게된다. 

### Other Neat Tricks
#### 1. demand zeroing
heap에 페이지를 하나 추가할 때, OS가 그때그때 페이지 테이블을 초기화하는 것은 비효율.
그냥 read만 되게끔 OS가 처리해두고, 만일 write 행위가 발생하면, 트랩을 발생시켜서 매핑해준다. 
#### 2. copy-on-write
OS가 페이지를 한 주소공간에서 다른 곳으로 복사한다고 했을 때, 그걸 그냥 복사하는 게 아니라 주소만 매핑해준다. 

쓰기 작업이 일어나면 트랩을 발생시켜 OS 호출 -> 새로운 페이지를 할당시켜서 매핑만 해준다. 
- UNIX 시스템에서 매우 중요. fork(), exec()작업이 있기 때문

## The Linux Virtual Memory System
user portion, kernel portion으로 나뉜다. 

kernel virtual address에는 두가지 타입의 종류가 이/ㅆ다. 
- logical
  - 연속적
  - DMA(Directory memory access)
  - I/O작업
- virtual
  - 할당이 조금 더 쉽다. 큰 크기의 버퍼 넣기 가능

페이지 테이블은 64비트 크기로 옮겨갔다.

큰 크기의 페이지를 지원한다. 그러나 이는 역시 내부화 문제로 필요할 때마다 천천히 도입하게된다. 

### 페이지 캐시
- memory mapped files
- anonymous memory
page replacement 전략: 2Q replacement: 두 개의 리스트로 나누어서, inactive, active로 분류한 다음 재할당 -> active로 옮겨간다. 

### 보안
예전의 OS와 다른 점은 보안에 대해 신경쓴다는 것이다. 

  