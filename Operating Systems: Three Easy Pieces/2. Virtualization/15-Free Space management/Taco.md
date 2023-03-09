어떻게 비어있는 공간을 관리하는가
- 다양한 크기의 공간을 관리할 때가 어렵다. 외부화가 일어난다. 
- 그래서 이 장에서는, 어떻게 이를 관리해볼지 고민한다. 
# 1. 가정
1. 기본적인 인터페이스로 malloc, free 에 의해제공되는 것 사용
2. 이 allocator가 관리하는 공간은 역사적으로 힙이었다. 힙 내의 자료구조는 free list 종류다. 
3. 우선적으로 외부 조각만 발생하는 것만 고려한다. 간단히 하기 위해서다. 
4. 일단 메모리가 주어지면 compaction은 일어나지 않는 것으로 가정
5. allocator는 연속적인 바이트 단위를 관리한다고 가정한다. 즉 고정된 크기다. 늘릴 수 없다.

# 2. 저수준 매커니즘
- splitting, coalescing에 대하여 먼저 알아야한다. 
- 어떻게 할당된 공간을 트래킹하는지 알아야한다. 
- 어떻게 free space 내에서 간단한 리스트를 만들어내는지 알아야한다. 

1. splitting, coalescing
    
    splitting이란, 요청에 맞는 free chunk를 발견하여 그 메모리를 둘로 나누고, 앞의 것에 할당한다. 요청이 free chunk 보다 작을 때!
    
    이렇게 나누어진 청크들은 free가 외쳐지면 coalesing 작업을 한다. 

2. 할당된 공간 트래킹
    free()는 size parameter를 가지지 않는다. 그래서 포인터가 주어지면 빠르게 그 메모리의 사이즈를 알아야한다. 
    이를 해결하기위해, header block이라는 것을 둔다. 헤더에는 사이즈에 대한 정보와 추가적으로 포인터가 있다. 
    magic number를 두어서 value sanity check도 할 수 있다.

    만약 N 바이트의 메모리를 요청한다면, 라이브러리는 N 사이즈의 free chunk를 찾는 것이 아니라, N + header 사이즈만큼의 free chunk를 찾게 된다.

3. Embedding a Free List
    어떻게 우리는 free space 자체에서 free chunk를 만들어낼까.
    메모리 할당 라이브러리 내에서 malloc을 쓸 수는 없다. 요청이 들어오면 사이즈 + 헤더 크기로 free chunk를 찾아서 할당한다. 
    free()가 되면, 여전히 여러 chunk들로 나뉘어있을 수 있는데, 이도 coalescing으로 처리한다. 

4. Growing the heap
    만약에 heap에 공간이 없으면, sbrk 요청으로 OS는 free physical page를 찾아낸다. 

# 3. Best Strategies
- free space를 관리하는 기본 전략들
- 좋은 allocator는 파편화를 최소화하면서도 빠르겠지만, 빠른것과 파편화는 함께 해결할 수 없는 문제다. 
- 그래서 best 보다는, 몇 기본전략들과 장단점을 논의하는 것이 맞다. 

1. Best Fit
   - 가장 차이가 나지 않는 free chunk에 할당
   - 대신 모든 chunk를 돌아야하는 문제
2. Worst Fit
   - best fit과 반대로, 가장 큰 크기의 chunk에 할당한다
   - 또다시 모든 서칭을 해야하여서 오버헤드가 크다. 

3. First Fit
   - speed가 좋다. 가장 먼저 보이는 chunk에 할당
   - 그래서 주소 기반 순서로 free list 순서를 관리해볼 수 있다. 
4. Next Fit
   - 항상 처음부터 청크를 살피는 게 아니라, 이전에 보았던 부분 다음부터 보아서 
   - 조금 더 uniformly하게 리스트를 관리 가능하다. 
# 4. 다른 접근들
   1. Segregated Lists
      - 만일 특정 어플리케이션의 자주 사용하는 사이즈 요청이 있다면, 그를 분리해서 놔둔다. 
      - 복잡하긴 하다. 얼마나 많은 메모리를 남겨두어야하는지에 대한 기준이 없다. 
      - 이를 Jeff Bonwick이라는 사람이 slab aloocator로 해결하였다. 커널이 부팅을 하면, object 캐시 몇을 할당해서, 그 캐시가 얼마 남지 않으면, slab을 더 요청한다. 
      - 이를 통해 잦은 초기화와 destruction 작업을 줄여 오버헤드를 줄인다. 
   2. Buddy Allocation 
      - coalescing을 쉽게하는 방법이다. 
      - free memory를 2^N의 사이즈라고 가정하고는, 
      - free 되었을 때 다 2의 승수로 나눠놓고, 인접한 영역이 2의 승수로 존재하면 그를 합친다. 