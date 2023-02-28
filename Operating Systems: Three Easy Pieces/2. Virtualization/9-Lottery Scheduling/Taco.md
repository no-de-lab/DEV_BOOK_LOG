특정 비율로 CPU를 공유하는 스케줄링 방식. 
매우자주, 랜덤으로 어떤 프로세스가 다음에 돌아갈지 결정한다. 

## Basic Concept: Tickets
ticket: 해당 스케줄링의 기본이 되는 개념. 프로세스가 받아야하는 자원 분배를 말한다.
스케줄러는 얼마나 많은 티켓 총량이 있는지 알아야하고, 그 중에 운영될 티켓을 고른다.
각 프로세스에 티켓 할당이 된 비율 정도에 따라서, 프로세스가 택해지는 경향이 있다. 
ex. A프로세스 75개, B 프로세스 25개면 랜덤을 돌렸을 때 대충 해당 비율로 티켓이 선택된다.

## Ticket Mechanisms
1. ticket currency: 유저가 비율로 티켓을 배분해놓으면 시스템이 알아서 전역 값으로 고쳐놓는다. 
2. ticket transfer: client/server setting에서, 혹시 server가 client 대신해줄 수 있는 일이있다면, 속도 증가를 위해 server에게 ticket을 보낼 수 있다. 
3. ticket inflation: 티켓 개수를 늘리거나 줄일 수 있다. greedy 프로세스 뿐만 아니라, 그냥 cpu시간이 더 필요하다고 느끼는 process가 티켓 밸류를 늘려서 다른 프로세스와의 상의없이 cpu를 가져가려할 수 있다.

## Implementation
실행이 간단하다. 좋은 랜덤 숫자 제너레이터를 만들면 될 뿐. 
linked list 형태로 count를 확인한다. (정렬된 상태라면 더 효율적인 것이다.)

## Assign Tickets
- 유저들이 다 안다는 가정하에 원하는대로 티켓을 할당하게 두기도 하지만, 이는 솔루션이아니다. 

## Stride Scheduling
온전한 랜덤은 정확한 비율을 보장하지 않기 때문에, stride scheduling이라는 것이 생겻다. 

티켓 비율 거꾸로 비율을 나눈다. ex) 100, 50, 250개의 티켓이 있었다면, 100, 200, 40으로 stride value를 얻게한다. 

프로세스 진행이 될 대마다 카운터를 증가시켜 전역 진행상태를 트래킹한다. 
처음에는 순서대로 진행을 하다가, 
이 stride를 이용해 다음에 어떤 프로세스가 돌아야하는지 결정한다. 가장 낮은 pass값을 선택하여 진행하되, pass counter + stride값을 현재 값으로 설정한다. 

정확하게 stride scheduling으로 스케줄링을 할 수 있는데, 굳이 lottery를 쓰는 이유? 
- 전역 상태가 없다. stride의 경우는 새로운 프로세스가 중간에 생기게 되면, 그것이 0으로 설정되어있기 때문에 분명 cpu를 독점하게 될 것이다.
- 그래서 더 쉽게 새로운 프로세스를 받아들일 수가 있다. 

## The Linux Completely Fair Scheduler
Completely Fair Scheduler 즉 CFS는 리눅스 운영체제에서 실행하는 fair-share 스케줄링이다. 
효율적이고, 확장성이 있다.
- 효율성을 위해 스케줄링 결정을 내리는 데 시간을 매우 적게 쓴다. 
- 기본 운영방식
  - virtual runtime이라는 기술을 사용, 공정하게 cpu를 나눈다. 
  - context switching과 cpu의 공정한 분배 사이를 줄다리기한다. 
    - sched_latency라는 제어 파라미터를 통함. 이를 기본 시분할 시간에서 나눈다. 그러면 한 프로세스에 할당된 시간이 나온다. 
    - 너무 많은 프로세스가 돌지 않게끔, min_granularity라는 파라미터도 둔다. 너무 작게 시간이 나뉘게 되면 오버헤드가 너무 커지기 때문이다. 
- 비중
  - 우선순위를 설정한다. 
  - nice level이라는, 유닉스 메커니즘을 통하여 이를 설정할 수 있고, 이를 통하여 시분할 시간을 결정한다.
  - 비중 값의 차이가 일정하다면, CPU 비율을 똑같이 유지할 수 있다. -5와 0, 5와 10은 각각 비중 차지가 같다. 
- Red-Black Trees
  - 다음 프로세스를 돌리려고 할 때, 최대한 빠르게 전환해야한다. 
  - 그를 할 수 있게 해주는 것이 red-black tree이고, 낮게 깊이를 유지하여, log 시간 안으로 작업이 이뤄지게 돕는다. 
  - 트리로 운영중인 프로세스를 구성하여 프로세스를 실행하기 위해 첫번째 element를 내보낸다. 
- I/O 와 잠든 프로세슬 다루기
  - 가장 낮은 vruntime을 다음 프로세스로 설정하는 것은 문제가 있을 수 있다. 자다 깬 프로세스가 cpu를 독점하여 다른 프로세스에 기아 상태를 줄 수 있기 때문이다. 
  - 그래서, cfs는 wake up한 프로세스의 vruntiom값을 바꿔준다. 해당 트리에서 최소한의 vruntime 값으로 바꿔준다. 
  - 그러나 이 방법은 아주 조금만 sleep하는 프로세스들이 공정히 share를 받지 못하게 하는 문제가 있다. 