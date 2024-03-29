기존- 2계층/3계층 동작 장비를 네트워크 장비라 하였으나, IP 부족으로 말미암은 여러 장비들이 등장, 4계층 이상에서 동작하는 네트워크 장비들로,
4계층에서 동작하는 장비도 네트워크 장비에 포함되었다.

- 통신의 방향성, 순서와 같은 통신 전반에 대한 관리 필요 => 세션 테이블에 보관
- 세션 정보가 중요. 그래서 4계층 이상에서 동작하는 장비를 세션 장비라고 부르기도.

1. 세션 테이블 
- 세션 정보를 저장, 확인하는 작업 전반에 대한 이해 필요
- 세션 테이블에 남아있는 라이프타임이 존재
2. 대칭 경로 요구
3. 정보 변경
등이 서비스에 영향을 미쳐서, 이에 대한 고려가 필요하다.

## 로드 밸런서
트래픽을 분배해주는 메인 기능
- 로드 밸런서가 서비스 대표 IP를 갖고, 그 밑에 시스템이 늘어나면, 실제 IP로 변경 후 요청
- 4계층과 7계층으로 나뉜다.

### L4 스위치
- 부하 분산, 성능 최적화, 리다이렉션 기능
- 가상 IP를 실제 IP로 변경
- TCP, UDP 정보 기반으로 부하 분산

### ADC
- 애플리케이션 프로토콜의 헤더와 내용을 이해해 동작하기 때문에, 다양한 부하 분산, 정보 수정, 정보 필터링이 가능하다.
- 이미지나 정적 콘텐츠 캐싱 등의, 부하가 많이 걸리는 작업을 별도로 수행한다.
- SSL 엔드포인트로 동작하기도

## 방화벽
- 네트워크 중간에 위치. 트래픽을 허용하거나 차단하는 장비
- 세션 정보를 장비 내부에 저장. -> 패킷의 인과 관계를 파악 가능

## 세션 주의할 점
1. 세션 관리
- 세션 타임아웃보다 애플리케이션 세션 타임아웃이 길면, 통신에 문제가 생긴다
이를 세션 장비 운영자/ 개발자 입장 각각이 해결할 수 있다.

### 세션 장비 운영자
- 세션 타임아웃 시간 증가
- 방화벽 설정 (방화벽 옵션 조정, 세션을 통과하게끔 허용)
- 세션 타임아웃 시 양 단말에 세션 종료 통보

### 개발자 입장
- 주기적 패킷 발생해 세션 상태 정보 체크

2. 비대칭 경로 문제
- 인바운드 패킷, 아웃바운드 패킷의 경로를 달리 하는 것
- 경로가 일정하지 않으면, 정상적 서비스가 되지 않는다. 
- 어쩔 수 없이 비대칭 경로가 생기면, 

### 세션 테이블 동기화
- 세션 테이블을 동기화하는 것.
- 세션 동기화 시간보다 패킷 응답이 빠르면 안됨

### 강제로 대칭 경로 만들기
- 방화벽 간 통신용 링크 필요
- MAC 리라이팅, 터널링 기법 등

## 하나의 통신에 두개이상의 세션
- 데이터 프로토콜: 데이터 실어 나름
- 컨트롤 프로토콜: 데이터 잘 전송되게 세션 제어
- 보통은 데이터/컨트롤 프로토콜 기능을 하나의 헤더나 별도 메세지로 해결하지만, FTP처럼 오래된 건 분리되어있다. 
- Active/ Passive 모드 존재

