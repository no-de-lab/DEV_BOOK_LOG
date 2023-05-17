새로운 파일 시스템을 고안한 버클리의 John Ousterhout, Mendel rosenblum.

그들의 동기는 아래와 같았다.
- 시스템 메모리가 커져서, disk traffic 도 커지고 write 성능에 따라 파일 시스템 성능이 결정되었다.
- 랜덤 I/O, 순차적 I/O 간의 큰 갭이 있는데, 순차의 경우 seek, rotational delay가 적다. 해당 부분은 느리게 발전되었으므로 순차적 IO를 사용하는 것이 이득이다.
- 존재하는 파일 시스템은 너무 대역폭이 짧다.
- 파일 시스템은 RAID 인지를 못한다.

해당 문제를 해결하는 새로운 파일 시스템이 필요했다. 
## Writing To Disk Sequentially
user가 data block을 쓸 때, 메타데이터도 함께 업데이트 된다. 

## Writing Sequentially And Effectively
순차적으로 디스크에 쓰는 것만으로는 효율적인 쓰기가 되기는 어렵다. 디스크가 로테이션이 되었다면 그만큼 기다려야한다. 
이를 해결하기 위해 write buffering이라는 것을 둔다. 
- 디스크에 쓰기 전에 업데이트를 트래킹해두고, 몇몇 업데이트가 쌓이면 디스크에 한번에 적어넣는다. 이를 세그먼트라 부른다. 

## How Much To Buffer? 
disk에 따라 다르다. 
- seek, rotation하는 시간과 transfer rate 비교.
- write 시간 = position 시간 + (총 량 / transfer rate)
- effective rate = 총 량 / write 시간
- 여기서 대략 peak rate을 F로 잡고 (F * peak rate)
- 계산하면 업무량 = F / (1-F) * peak rate * position time

## Problem: Finding Inodes
LFS에서는, inode 를 찾기 더 어렵다. 디스크 전체적으로 흩뿌려놓았기 때문이다. 

## Solution Through Indirection: The Inode Map
이를 해결하기위해 간접 레벨이라는 것을 가져왔다. inode number를 인풋으로 하고 디스크 주소를 만들어낸다. 이를 imap이라 한다.
그런데 imap은 지속적이어야한다. 더군다나 고정되어있으면 seek 시간이 오래걸리므로 새로운 정보 옆에다가 둔다. 