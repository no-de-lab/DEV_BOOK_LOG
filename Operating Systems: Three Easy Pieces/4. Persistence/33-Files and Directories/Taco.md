- 가상화는 시스템 프로그래밍을 더 쉽고 많이 쓰게 만들었다.
  - cpu 가상화 -> 프로세스
  - 메모리 가상화 -> 주소 공간

여기서 한가지 가상화가 더 있는데, 그는 영구적 저장소인 HDD, SSD다.
아무래도 영구적이기 때문에, OS는 더욱 더 신경을 써야하는데, 어떻게 관리할까?

## Files and Directories
스토리지 가상화 영역에서의 추상화는 두 가지가 있다. 
- file
  - linear array of bytes, 각 파일은 inode number를 가지고 있다.
  - OS는 파일 구조에 대해서는 잘 모르고, 그냥 서로의 일을 잘 하면 된다.

- directory
  - file처럼 inode number가 있지만, 그와 함께 user-readable name도 있다. 
  - root directory부터, 그 아래의 디렉토리로 명명할 separator를 사용한다. 

## The File System Interface
### Creating Files
`open` 시스템 콜로 이루어진다. 또한 그와 함께 O_CREAT라는 플래그를 전달한다. 
> int fd = open("foo", O_CREAT);
- 이는 만약 없으면 만들라는 뜻이다. 
- open의 중요한 측면은 그가 file descriptor를 리턴한다는 것이다.
  - 이는 프로세스마다 있는 private한 int다. 이는 그에 대한 접근 권한을 말한다. 
  - 또한 그는 파일에대한 포인터를 말한다.
  - 이는 OS에 의하여 컨트롤된다. 

### Reading And Writing Files
`cat` screen으로 컨텐츠를 볼 수 있다. 그런데 어떻게 해당 파일에 접근할까? 
- 리눅스에서는 그를 strace를 통해 가능하게 한다. 
- 먼저 open하고, read해서 반복적으로 바이트를 읽어낸다. 읽어낼 것이 없으면 0을 반환하고, close를 한다. 

### Reading And Writing, But Not Sequentially
위의 사례는 순차적이었다. 그러나 가끔은 특정 부분부터 읽거나 쓰기를 할 일이 더 유용하다. 그때는 `lseek` 시스템 콜을 사용한다.
텍스트에서 index를 구성하면, whence라는 옵션에 의해 offset과 관련한 파일을 읽게된다. 

### Shared File Table Entries: fork() And dup()
각 프로세스에서 여는 파일은 같은 파일이더라도 독립적이다. open file table이 다르기 때문이다.
- 그런데 이 테이블이 공유될 때가 있다. 
  - parent process가 child process를 fork할때다. 포크 시 레퍼런스 카운트가 올라가고, 테이블을 공유하면 이 카운트가 증가된다. 
    - 이는 여러 프로세스를 만들어서 동시에 일을 할 때, 유용하다.
  - 다른 하나는 dup이다. 이는 프로세스로 하여금 새로운 file descriptor를 이미 존재하는 descriptor를 참조하도록 만들 수 있다. 

### Writing Immediately With fsync()
program이 write를 호출할 때, 실은 언젠가 영구 저장소에 이를 써줘라는 뜻이다. 
그래서 파일시스템은, 성능 이유로 몇 write를 메모리에 buffer하고는 언젠가 그를 저장해준다. 
- 이 관점에서 볼 때, 드물게는 데이터가 크래시되어 없어질 수도 있다. 

그러나, 몇 어플리케이션에서는 데이터가 보장되어야한다. ex. dbms에서의 리커버리 프로토콜
- 이를 위해 fsync(int fd)라는 것이 있다. 파일시스템으로 하여금 모든 dirty data를 디스크에 저장하게 하는 것이다. 
- 그런데 이를 파일 단위로 사용하면, 확실히 쓰기되지 않을 수 있다. 디렉토리 단위로 확실하게 sync 시켜주어야한다.

### Renaming Files
- mv 라는 명령어를 통해서 이름을 바꿀 수 잇는데, 이는 사실 rename이라는 시스템콜을 통해 행해진다. 
- 이는 원자적이다. 

### Getting Info About Files
- 메타데이터라 불리는, 파일에 관한 데이터가 있다. 
- stat(), fstat() 명령어로 그를 몰 수 잇다. 
- 사이즈나, inode number같은 로우레벨 이름이나, 접근 수정 시간같은 것을 볼 수 있다.
- 각 파일 시스템은 이러한 종류의 정보를 inode 안에 넣는다. 

### Removing Files
- file 삭제를 위해서 rm 명령어를 사용하는데, 이 때 사용되는 시스템 콜은 unlink다.
- 왜 언링크인지는 디렉토리를 조금 더 이해해야한다.

### Making Directories
디렉토리는 파일시스템의 메타데이터로 여겨지기 때문에, 디렉토리를 업데이트 하는 방법은 간접적으로 그 안에 파일을 생성하는 것이다. 
- mkdir 명령어를 통해 만들 수 있다. 

### Reading Directories
- directory를 읽을 때, 그냥 파일처럼 오픈하는 게 아니라, opendir, readdir, closedir 만을 사용하고, 디렉토리 내의 파일을 모두 읽어온다.

### Deleting Directories
- rmdir을 사용하면 되는데 위험하기 때문에 디렉토리가 비어있는 상태라는 조건이 있다. 

### Hard Links
- link라는 것은 간단하게 디렉토리에 다른 이름을 만들어내서 그것을 기존 어떤 파일과 같은 inode number를 참조하게 한다. 
- 실제로 파일을 만들 때, 일단 inode 구조를 만들고, 이와 사람이 읽을만한 이름을 연결짓는다. 
- unlink는 이러한 연결을 끊어낸다. 

### Symbolic Links
또 다른 링크는 soft link라고도 불리는 symbolic link다.
- ln -s 로 가능.
- 이는 링크된 파일이 삭제되면 그것이 가리키고 있던 path도 삭제가 되어 댕글링 참조의 가능성을 남긴다.

### Permission Bits and Access Control Lists
파일 시스템은 디스크를 가상화한다. raw block들을 유저 친화적으로 바꾸는 것이다. 이는 여러 사용자들과 프로세스들에게 보통 공유된다. 그래서, 그 공유의 수준을 결정하는 매커니즘이 파일 시스템에 있다. 이를 permission bitfk gksek. 
- 9개의 캐릭터로 그를 구분한다. 3자는 파일 주인, 다음 3자는 그룹, 다음 3자는 그외의 사람이다. 
- 파일 주인은 파일 모드를 바꿀 수 있다. (chmod)