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

## Completing The Solution: The Checkpoint Region
어떻게 inode map을 찾을 수 있는가? 이에 대해서 고정되고 알려진 장소가 필요하다.
LFS는 Checkpoint region이라 알려진 고정된 장소가 ㅣㅇㅆ다. 
- inode에 대한 포인터들을 저장한다. 
- 주기적으로 업데이트되어서 퍼포먼스에는 지장이 없다. 
- 그러므로 전체적인 구조는 inode map -> inode를 가리키고 inode -> file 을 가리킨다. 

## What about Directories?
파일시스템에서 파일에 접근하기 위해서는 사실 디렉토리도 접근되어야한다. 어떻게 디렉토리에 접근할까? 
- 디렉토리의 위치를 찾아서 파일에 접근할 때, 우선 inode map으로 디렉토리 inode에 접근하고, 그 후 디렉토리에 접근하면 data block으로부터 file명과 inode 값을 얻게 된다. 그 이후 다시 imap에서 이를 찾아 파일을 찾는다.
- 파일 inode를 변경할 때, 디렉토리의 업데이트도 업데이트 되고, 그 디렉토리의 디렉토리도 업데이트 될 수 있는 문제를 해결했다. 
  - inode 위치가 바뀌더라도 디렉토리 자체에 변하지는 않는다. imap의 구조가 바뀐다.

## A New Problem: Garbage Collection
LFS의 문제는 지속적으로 파일의 최신 버전을 새로운 디스크의 위치에 쓴다는 것이다. 
즉 오래된 버전은 디스크에 널려있다. 이를 가비지라고 부른다. 

이런 오래된 버전들은 사용자로 하여금 예전 버전을 사용하고 싶을 때를 대비하여 남겨둘수도 있다. 이를 버전 파일시스템이라 한다. 

그러나, LFS는 최신의 버전만 유지하기로 한다. 예전의 버전들을 찾아내어 없앤다. 이를 가비지 콜렉션이라 부른다. 

LFS는 세그먼트-by-세그먼트 전략으로 커다란 청크를 없앤다. 
기본 과정은, 주기적으로 오래된 세그먼트를 파악하고 어떤 것이 살아남을지 결정한다. 그리고 새로운 세그먼트 셋을 적는다.
- 그렇다면 어떻게 데이터 블록에 살아남고 죽는지 말할까? 
- 또한, 얼마나 자주 해당 작업을 해야할까? 

## Determining Block Liveness
데이터 블록에 inode number, offset을 적어둔다. 
이 정보는 세그먼트 헤드에 세그먼트 서머리 블록이라는 곳에 기록된다. 

LFS는 해당 블록으로 inode가 오프셋만큼의 블록에 해당 파일을 가지고 잇는지를 파악해서 아니라면 죽었다고 판단한다. 
더 효율적으로 이를 판단하는 방법은 파일이 변경되거나 삭제되었을 때 version number를 추가하여 imap에 그의 버전 넘버를 기록하는 것이다. 
그저 버전넘버만 비교하여 굳이 읽는 과정을 생략할 수 있다.

## A Policy Question: Which Blocks To Clean, And When? 
어떤 세그먼트를 없앨지 말지 고민도 해야한다. 
- hot segment: 자주 덮어씌워지는 세그먼트. 없애기 전에 좀 기다려야한다. 
- cold segment: stable하다. 
- 그래서 몇몇은 cold를 더 일찍 제거해야한다고 하지만 완벽하지는 않다. 

## Crash Recovery And the Log
LFS가 쓰기를 하는 중에 system이 크래시가 나면 어떤 일이 발생할까.

보통같으면 버퍼가 채워졌을 때 쓰기를 로그에 정돈한다. 또한 주기적으로 체크포인트 장소를 업데이트한다. 
이 두 과정 중 하나의 과정에 크래시가 일어날텐데, 어떻게 이를 다룰 것인가? 
- CR update 가 원자적으로 일어나게 하기위해서, 두개의 CR을 가지고, 그 중 하나만 헤더, 바디, 마지막 블록을 업데이트 한다. 만약 크래시가 나면, 타임스탬프에서 지속적이지 않음을 느끼고, 지속적인 것들 중에 가장 최신 것으로 통일시킨다. 
- 또한 파일 시스템에서 가장 나중에 찍힌 스냅샷은 삭제한다. 
  - 이를 좀 개선하기 위해서 roll forward라는 것도 쓰는데, 가장 나중의 체크포인트 공간에서 끝을 파악하고 read해서 유의미한 업데이트를 파악해서 있다면 파일 시스템을 업데이트한다. 