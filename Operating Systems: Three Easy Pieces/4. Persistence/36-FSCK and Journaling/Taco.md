파일 시스템은 자료 구조를 관리하게 된다. 추상화를 실현하는 것이다. 
동시에, 파일 시스템은 영구적 데이터를 저장해야하기에 persistency가 있어야한다.

그런데, 작업 중간에 crash가 날 경우: 자료를 유지하는 것이 당연히 어렵다.

그렇다면, 어떻게 크래시 상황에서도 업데이트를 할 수 있을까? 

## A detailed Example
- inode
- bitmap
- data block 

구조로 이루어져있는 디스크가 있는 상황에서

- write는 실시간 처리는 안된다. 우선 메모리에 저장해둔 상태에서 크래시가 날 경우
- 이상하게도 위의 세 구조 중 몇은 write가 성공하고 몇은 실패하는 상태가 보여질 수 있다. 
  - 예를 들자면
  - data block만 디스크에 업데이트: 이 경우 write 가 한번도 일어나지 않는것과 다를바가 없어서 consistency 관점에서는 문제가 아니다.
  - inode만 업데이트: 가비지 데이터가 쌓인다. 
  - bitmap: 공간 leak
  - inode & bitmap: garbage
  - inode & data block: inconsistency 문제 해결 필요
  - bitmap & data block: 포인터가 없는 상태
- 즉 동시성 문제들이 일어나는데, 어떤 것은 가비지 데이터가 쌓이는 것이고 어떤 것은 공간이 낭비되는 것이다. 이를 해결해야한다.

## 1. The File System Checker (fsck)
- simple approach 
- Unix tool
- 일단 동시성 문제가 일어나게 두고 나중에 고치는 것이다. 
- 제일 먼저 superblock sanity check
- 다음으로 Free blocks
- Inode state
- Inode Links
- Duplicates
- Bad blocks
- Directory checks
- 코드가 잘되는지에 대한 파악을 하는데 너무 성능이 느리다. 불필요하게 전체 디스크를 스캔하기도 한다. 

## 2. Journaling
disk를 업데이트 할 때, 크래시가 나면 뒤로 돌아가 try again 한다. 어디서 고쳐야할지 알게된다. 
- linux ext3 file system
  - TxB:업데이트 정보가 들어있는 블록
  - physical block: physical logging 하는 블록 (inode, data block, bitmap)
  - TID
- transaction이 디스크에 안전하게 올라오면, 덮어쓴다. 이를 체크포인팅이라 부른다. 
- 위의 블록들을 하나씩 업데이트 하는 것은 너무 느리므로, 한번에 하는 것이 좋은데 안전하지는 않다. 몇몇은 업데이트가 되지 않는다. 