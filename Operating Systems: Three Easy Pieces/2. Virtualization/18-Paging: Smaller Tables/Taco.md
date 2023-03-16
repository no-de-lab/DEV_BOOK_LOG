페이지 테이블은 너무 크고 너무 많은 메모리를 차지했었다. 
어떻게 하면 페이지 테이블을 작게할 수 있을까? 

## 첫번째: bigger pages
page 자체를 크게 만들어서, 페이지 테이블의 사이즈를 줄일 수 있다. 
- 그치만 이는 페이지가 크므로 내부 fragmentation이 일어난다. 그래서 문제는 여전히 풀리지 않앗다. 

## page and segments hybrid approach
- 세그멘테이션과 페이지를 결합하는 솔루션
  - 메모리를 줄임
  - segmentation의 base, bound, limit register 사용, base를 페이지 테이블의 물리적 주소로 잡는다. bounds는 페이지 테이블의 끝을 가리킨다. ㅏ
  - 할당되지 않으면 공간차지 안한다. 
- 대신 문제는 segmentation이 유연하지 않고, 외부 fragmentation 문제

## multi-level page tables
세그멘테이션이 아닌 접근으로는 multi level page table이 있다. 
- 페이지 테이블을 페이지 사이즈 단위로 나누어서, invalid하면 페이지 테이블에 할당하지 않는다. 
- 페이지 데렉토리로 페이지가 valid한지 트래킹할 수 있다.
- 페이지 디렉토리는 여러 엔트리를 가지고, valid bit, page frame number를 엔트리가 가진다. 
- PDE가 밸리드하면, 최소 한 페이지 테이블의 페이지는 valid하다. 
  - 이는 주소 공간을 실제ㅐ 사용하는 만큼 할당한다. 
  - 잘 설계되면, 페이지 안에서 각 페이지 테이블이 잘 맞아서 메모리를 관리하기 쉬워진다. 