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
- 이 문제를 피하기 위해 파일시스템은 transactional write를 도입했다. 
  - 첫째, TxE 제외 다른 모든 블록을 write한다.
  - 모든 write이 끝나면 TxE 블록을 붙여 안전한 상태로 만든다. 
  - 이를 통해 원자성을 보증할 수 있다. 512바이트 정도다. 
  - Journal write > Journal commit > Checkpoint

### Recovery
crash는 언제든지 일어날 수 있다. 

- 만약 크래시가 commit 이후에 난다 할지라도 체크포인트가 끝나지 않았다면 recover는 가능하다. 
  - 파일 시스템이 로그를 스캔하고, 커밋된 트랜잭션을 확인한다. 그리고 그 트랜잭션을 재 시도한다. 이를 redo logging이라 한다. 

### Batching Log Updates
basic protocol은 추가적인 디스크 트래픽을 유발한다. 
같은 디렉토리 내에서 두개의 파일이 생성될 때, 결국 같은 inode를 가진 블록 안에서 업데이트가 일어나므로 주의하지 않으면 같은 블록을 쓰고 또 쓰는 불필요한 트래픽이 발생한다.

따라서, 이를 동시에 업데이트 하는 것이 아니라 버퍼를 만들어서 과도한 트래픽을 막는다.

### Making the Log Finite
log가 꽉차면 리커버리가 더 길어진다. 또한 트랜잭션이 디스크에 커밋될 수가 없다.
- 따라서 journaling file system은 로그를 원형 구조로 만든다. 
- 트랜잭션이 체크포인트 되면 그 공간을 free시킨다. 

### Metadata Journaling
recovery는 상대적으로 빨라졌지만 일반 작업은 원하는 만큼 속도가 나지 않는다. 
특히, write할 때 journal에 먼저 쓰는 행동으로 인하여 트래픽이 두배가 된다. 

이를 해결하기위해 좀 더 간단한 metadata journaling이 등장했다. 
- inode, bitmap이 업데이트로그에 저장되고 데이터는 최종 장소에 쓰여진다. 
- 데이터가 제일 먼저 쓰여져서 파일 시스템은 포인터가 가비지 값을 가리키지 않음을 보장한다. 
- 이는 정확도를 위해서라기보다는 동시성 이슈를 해결하기 위한 것이다. 

### Tricky case: Block Reuse
디렉토리를 만들고 삭제한 뒤 새로운 파일을 생성했는데, 크래시가 metadata journal에 나면, 데이터가 로그에 적히지 않기 때문에 이상한 정보가 들어가게된다. 
- 이를 해결하기위해 블록 삭제가 체크포인트 되기 이전에 다시 블록을 쓰지 않는 방법이 있다.
- 그 외에는 revoke라는 걸 써서, 디렉토리 삭제 시 revoke record를 통하여 해당 \레코드를 로그에서 되풀이하지 않는 방식을 쓴다.

## 그외
- Soft Updates
  - file system의 모든 쓰기 순서를 정한다. 
  - 복잡
- copy on write
- overwrite하지않고 새로운 업데이트를 디스크의 사용하지 않은 부분에 한다. 