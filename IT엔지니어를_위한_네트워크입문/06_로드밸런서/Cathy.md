# 6장 로드 밸런서/방화벽: 4계층 장비(세션 장비)

기존 네트워크 장비는 2,3 계층에서 동작하는 장비를 지칭하는 용어였지만 
IP 부족, NAT 기술, 방화벽, 프록시 같은 장비들이 등장하면서 4계층에서 동작하는 장비도 네트워크 장비에 포함됨

4계층 장비는 포트번호, 시퀀스 번호, ACK 번호를 이해 해야함
2,3계층과 달리 통신의 방향성이나 순서, 통신 전반의 내용을 담은 세션 테이블을 관리하고, 그 기반으로 작동해야함

## 4계층 장비의 특징
TCP와 같은 4계층 헤더에 있는 정보를 이해하고 이 정보들 기반으로 동작한다.
4계층 프로토콜 동작에 대한 깊은 이해 필요 (세션 테이블, 세션 정보가 가장 중요)

- 세션 장비 고려할 요소
  - 세션 장비는 세션 테이블 기반으로 운영
  - 세션 정보를 저장, 확인하는 작업 전반에 대한 이해 필요
  - 세션 정보는 라이프 타임 존재 -> 이에 대한 고려 필요
  - 인바운드 아웃바은드 경로 일치
  - IP주소가 변경되며 L7 로드밸런서(ADC)는 애플리케이션 프로토콜 정보도 변경함
위와 같은 고려 요소가 있기에 네트워크 통신 중간 위치에서 세션 기반으로 동작하는 방화벽 NAT 로드 밸런서와 같은 장비가 있을경우,
네트워크 인프라, 시스템 설계, 애플리케이션 개발에도 세션 장비에 대한 고려가 필요....!
> 애플리케이션 개발에서는... 어떻게 고려해볼 수 있을까?

## 4계층 장비의 종류
### 로드밸런스
서버나 장비의 부하를 분산하기 위해 사용하는 장비
트래픽을 분배해주는 기능으로 4계층 이상에서 동작 IP주소, 4계층 정보, 애플리케이션 _정보를 확인, 수정하는 기능_ 이 있다.

> 로드 밸런서가 정보를 수정하는 기눙도 있다?
> 스케일아웃으로 시스템을 확장했을 경우, 여러대의 서버 배치와 상관없이 하나의 서비스로 보여야함
> 로드 밸런서가 서비스에 사용되는 대표 IP 주소를 서비스 IP로 각 서버의 요청들의 IP을 변경해 요청함
> 하나의 서비스로 보이는 역할을 함

- L4 로드 밸런싱
 - 일반적인 로드 밸런서가 동작하는 방식
 - TCP, UDP(4계층에 대한) 정보로만 분산처리하는 경우
- L7 로드 밸런싱
  - 프로토콜 정보를 기반으로 로드 밸런싱 수행
  - HTTP헤더, URI와 같은 정보를 기반으로 부하를 분산 -> 
  - 이러한 것을 ADC 라고 부르고 프록시 역할을 수행

- L4 스위치
  - 4계층에서 동작하고 로드 밸런서 기능이 있는 스위치
  - 외형은 스위치처럼 여러 개의 포트를 가지고 있음
  - 부하 분산, 성능 최적화, 리다이렉션 기능을 제공
  - 동작하기 위해 가상 서버, 가상 IP, 리얼 서버, 리얼 IP를 설정해야함
  - 가상 IP를 리얼 IP로 변경해주는 역할을 함

- ADC
 - 애플리케이션 계층에서 동작하는 로드 밸런서
 - L4 스위치와 달리 프로토콜의 헤더와 내용을 이해하고 동작
 - 부하 분산, 정보 수정, 정보 필터링
 - 프락시로 동작
 - 최적화 기능 위해 캐싱, 압축, 콘텐츠 변환 및 재작성, 인코딩 변환 등 가능

L4 스위치 VS ADC
- L4 스위치는 TCP계층에서 최적화와 보안 기능도 함께 제공
- L4 스위치는 서버 부하를 줄이기 위해 TCP 세션 재사용
- ADC는 서버에서 수행하는 작업 중 부하가 많이걸리는 작업을 별도로 수행 (이미지, 정적 콘텐츠 캐싱)

> 프론트에서 더 가깝게 접하는 로드밸런스는 ADC?!!!!!

시스템 확장 방법
스케일업 VS 스케일아웃
스케일업 - 스케일 사이즈 자체를 키우는 것 <-> 스케일다운
스케일아웃 - 기존 스케일을 여러개 사용해서 트래픽 관리 <-> 스케일 인

### 방화벽
네트워크 중간에 위치하여 트래픽을 사전에 주어진 정책 조건에 맞추어 허용 또는 차단하는 장비
일반적으로 3,4계층에서 동작하고 세션을 인지, 관리하는 SPI엔진을 기반으로 동작하는 장비

## 장비 구성의 유의점
세션 장비(로드밸런스, 방화벽)는 2,3 계층 네트워크 장비와 달리 세션을 이해하고 세션 테이블을 유지
세션 테이블 정보를 이용해 패킷을 변경하거나 애플리케이션 성능을 최적화, 보안 강화, 패킷을 전송 또는 버릴 수 있음
이러한 기능을 위해 _애플리케이션과 세션 장비 간 세션 정보를 동일하게 유지_ 해야함
- 애플리케이션과 세션 장비 간 서비스 방향성
- 애플리케이션과 세션 장비 간 비대칭 경로를 피하는 것이 매우 중요

1. 세션 테이블 유지, 세션 정보 동기화
(애플리케이션과 세션 장비의 세션 타임을 일치시키는 방법)
- 세션 장비 운영자
  - 세션 만료 시간 증가
  - 방화벽 설정 (전체 보안을 취약해짐으로 비추천)
  - 세션 방비에서 세션 타임아웃 시 양 단말에 세션 정료 통보
    - 양 종단 장비에서 세션 정보 만료 (RST) 통보하여 비 정상적 통신 방지
- 개발자 입장
  - 애플리케이션에서 주기적인 패킷 발생 기능 추가
    - 세션 상태 정보를 체크하는 더미 패킷을 보내는 기능

2. 비대칭 경로 문제
네트워크의 안정성을 높이기 위해 네트워크 회선과 장비를 이중화
때문에 패킷이 지나가는 경로가 2개 이상으로 패킷의 경로가 같거(대칭 경로)나 다를(비대칭 경로) 수 있음

비대칭 경로일 경우 정상적인 서비스가 되지 않음
비대칭 경로의 문제의 해결 방법으로 
- 세션 테이블 동기화
  - 두 개의 경로가 하나의 경로로 동작하여 비대칭 문제 해결
  - 세션 동기화 시간보다 패킷 응답이 빠르면 안됨
- 경로 보정
  - 강제로 대칭 경로를 만들어 문제 해결
  - 통신용 링크 필요
  - MAC 주소를 변경하는 리라이팅 또는 기존 패킷에 MAC주소를 인캡슐레이션하는 터널링 기법으로 경로 보정

