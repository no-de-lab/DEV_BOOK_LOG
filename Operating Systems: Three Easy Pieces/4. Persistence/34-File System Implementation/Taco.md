vsfs라고 불리는 (Very Simple File System) 파일 시스템의 실행과 관련한 내용을 다룬다. 
- 전형적인 유닉스 파일 시스템의 심플한 버전이고, 온디스크 구조, 접근 메서드, 다양한 정책들의 기본적 내용을 알 수 있다. 

파일 시스템은 순수한 소프트웨어다. CPU나 메모리 가상화의 발전과는 다르게 하드웨어 기능을 넣지 않는다. 

어떻게 심플한 파일 시스템을 만들어낼 수 있을까? 어떤 구조가 필요할까? 
파일 시스템의 유연한 특성 덕분에 수많은 다양한 파일 시스템이 있다. 

## 1. The Way To Think
file system에는 두가지 다른 관점이 있다. 
1. 자료구조
   - 간단한 블록 어데이나 개체, 혹은 더 복잡한 트리 베이스 구조들이 있다. 
2. 접근 메서드: 어떻게 프로세스 호출을 매핑하는가 
   - 어떤 구조가 읽혀지고 쓰여지는가? 

## 2. Overall organization
전반적인 온디스크 구조를 만들기 위해, 제일 처음으로 디스크를 블록으로 나누어야한다. 

그 다음으로는, 블록에 무엇을 담을 것인지를 생각해야한다. 
- user data
  - fixed position에 얼마간 해당 데이터 공간을 만든다. 
- 조금은 메타데이터 정보도 fixed 되어야한다.  (inode라고 불리는)
- 메타데이터와 user data를 트래킹할 allocation structure도 필요하다. 
  - free list
  - bitmap 
  - inode bitmap
- superblock
  - 파일 시스템에 대한 정보. 몇번 블록에서 무엇이 시작되는지 등을 알 수 있다. 
  - OS가 제일 처음 이를 확인 

## 3. File Organization: The Inode
inode: 가장 중요한 온디스크 구조 중 하나. -> index node의 줄임말. 
- inode number 를 읽기 위해서 파일 시스템은 inode 공간에서 오프셋을 계산해야한다. (start address + num * sizeof(inode))
- inode 내부에는 타입, 사이즈, 블록 넘버 등이 들어있다. 
- 가장 중요한 inode 디자인 결정 중 하나는 어떤 데이터 블록을 참조하는지이다. 각 포인터는 파일에 속한 디스크 블록을 참조한다. 그런데 너무 큰 파일을 만들고자 한다면, 제한된다.
- 그래서 간접 포인터라는 것도 있다. 직접 포인터 외에 간접 포인터도 두어서 파일이 커지게되면 할당된다. 
  - 이를 멀티레벨인덱스라고 부른다. 
  - 대부분의 파일이 작기 때문에 이를 할 수 있다. 

## 4. Directory Organization
주어진 디렉토리 내의 파일과 디렉토리에는 inode number, record length(총 남은 공간 바이트), 실제 이름 길이, 엔트리명 등의 정보가 있다. 
- 디렉토리도 inode가 있다. 

## Free Space Management
어떤 inode, data block이 free한지 트래킹을 해야한다. 
- vsfs에서는 두가지 간단한 비트맵이 있다. 
  - 파일 생성시, inode 할당 -> Inode에 1 마크하고 온디스크 비트맵 업데이트
  - 데이터 블록을 파일에 할당할 때 파일 시스템은 새로이 생성된 파일에 free block을 할당한다. 

## 6. Access paths: Reading And Writing
root부터 시작해서 순회한다. 
- 오픈하면 read system call로 블록 위치를 파악하며 읽는다. 
- write도 마찬가지로 순회한 후 오픈한다. 리딩과 다른점은 블록을 할당하는 것이다. 
- 많은 i/o 과정이 필요하다
## 7. 캐싱과 버퍼링
많은 i/o 작업이 걸리는 걸 보완하기 위해서 캐싱 시도를 한다. 
- write의 경우 버퍼링 시 더 많은 이득을 보게된다. 
  - 스케줄링하거나 잦은 변경 등에서 위험이 덜하다. 
  - 몇몇은 direct i.o를 하기도 한다. 
  - 