# 3장 네트워크 통신하기

## 유니, 멀티, 브로드, 애니 캐스트
통신 방식을 구분할 때 중요점은 출발지 기준이 아니라, 목적지 주소를 기준으로 구분
- 유니 캐스트 
  - 1:1, 출발지 목적지가 1:1 통신
- 멀티 캐스트 
  - 1:모든통신, 동일 네트워크에 존재하는 모든 호스트가 목적지
- 브로드 캐스트
  - 1:그룹, 하나의 출발지에서 다수의 특정 목적지 데이터 전송
- 애니 캐스트
  - 1:1(목적지가 동일 구릅 내에서 1개 호스트), 동일 그룹중 가장 가까운 호스트에서 응답

## MAC 주소
2계층에서 통신을 위해 네트워크 인터페이스에 할당된 고유 식별자
네트워크에 접속하는 모든 장비는 MAC 주소라는 물리적주소가 있어야함
_변경할 수 없도록 하드웨어에 고정되어 출하됨_ -> 주소변경하여 NIC(네트워크 인터페이스 카드) 동작 가능함
네트워크 구성 요소마다 다른 주소를 가지고 있음
제조업체가 하나 이상의 주소플을 받아 자체적으로 MAC 주소 할당
OUI : 제조사 코드 IEEE에서 관리
UAA : 제조사에서 네트워크 구성 요소에 할당하는 부분 
MAC 주소는 NIC에 종속되기 때문에 NIC가 여러 개라면 MAC 주소도 여러 개 

## IP주소
7계층에서 주소를 갖는 계층은 2,3 계층 IP는 3계층에서 사용됨
대부분의 네트워크가 TCP/IP로 동작하므로 IP 주소 체계를 이해하는 것이 네트워크 이해에 매우 중요
- 사용자가 변경 가능한 논리 주소
- 레벨이 있는 주소 
  - 네트워크 주소 : 호스트들을 모은 네트워크를 자칭하는 주소
  - 호스트 주소 : 하나의 네트워크내에 존재하는 호스트를 구분하기 위한 주소

과거 클래스 기반의 네트워크 분할 기법 사용 -> 현재는 네트워크 주소를 세밀하게 분할, 할당
> 클래스 단위로 네트워크가 분할된다 -> 이거 신기하당

## 클래스풀과 클래스리스
인터넷이 상용화 되면서 IP 주소요구 증가하였지만, 기존 분할 방식으로는 IP개수가 부족, 낭비되는 문제발생
이를 해결하기 위해
- 클래스리스, CIDR 기반의 주소 체계
  IPv4 자체가 주소가 부족한 것이 있긴하지만, 주소를 제대로 사용 못하고 낭비되는 문제가 있음 (할당받은 조직이 사용하지 않는 IP는 다른곳에서 사용하지 못함)
  클래스 개념을 버림, 때문에 서브넷 마스크로 IP주소와 네트워크(255), 호스트(0) 구분
- NAT와 사설 IP주소
- IPv6(128비트) (IPv4 - 32비트)

## 서브네팅
모르겠따 다시 읽어봐야지...

## 공인 IP와 사설 IP
공인 IP - 인터넷 접속에 필요한 유일한 식별자
사설 IP - 인터넷 연결없이 개인적으로 네트워크 구성할때 사용하는 주소

인터넷에 접속하지 않거나, NAT(네트워크 주소 변환)기술을 사용할 경우 사설IP사용
사설IP 로 직접 인터넷 접속을 하지는 못하나 NAT로 공인 IP 변경 후 인터넷 접속 가능 (WebRTC IP 연결할때)

## TCP 와 UDP
2, 3계층은 목적지를 정확히 찾아가기 위한 주소제공이 목적,
4계층은 목적지 프로세스를 정확히 찾아가고, 패킷 순서가 바뀌지 않도록 잘 조합 -> 데이터 생성 역할
서비스를 정상적으로 제공할 수 있는 것이 목적(시퀀스와 ACK 번호를 사용)
### TCP
정보유실 없는 통신을보장하기 위해 세션을 안전하게 연결, 데이터를 분할하고 잘 전송 되었는지 확인하는 기능(패킷에 시퀀스부여하고 ACK를 받음)
TCP는 일방적으로 패킷을 보내는 것이 아니라, 상대방이 얼마나 잘 받았는지 확인하기 위해 ACK를 확인하고 다음 패킷 전송
1:1로 ACK를 계속 받아오면 통신이 느리기에 여러개의 패킷을 보내고 하나의 ACK받는 방식을 사용하는 것이 효율적이지만
정보가 유실될 확율이 높아짐, 적절한 송신량을 결정해야 함.
한번에 데이터를 받을 수 있는 데이터 크기를 윈도 사이즈라고 하는데 네트워크에 따라 조절하는 것이 _슬라이딩 윈도_ 라고함
### 3방향 핸드쉐이크
목적지가 통신할 준비가 되었는지 미리 확인하는 작업
3방향 핸드쉐이크 과정이 생겨, 기존 통신과 새로운 통신을 구분해야함 때문에 헤더에 플래그 라는 값을 넣어 통신
TCP 플래그
- SYN 연결 시작 용도
- ACK 응답, 유효할 경우 1로 표시
- FIN 정상 연결 종료 1
- RST 비정상(강제) 연결 종료
- URG 긴급 데이터 1
- PSH 전송할 데이터 없거나, 데이터 버퍼링 없이 어플리케이션에 즉시 전달할 때 

### UDP
TCP의 기능이 1도 없음, UDP는 데이터 전송을 보장하지 않는 프로토콜(제한적 사용)
떄문에 응답속도가 빠름 -> 속도에 민감한 실시간 서비스를 제공하는 경우 사용한다 
데이터가 유실되어도유실된 상태로 데이터를 처리함
멀티 캐스트 처럼 단방향으로 다수의 단말과 통신하는 경우 (스트리밍, 증권 시세 서비스 )
UDP 첫 데이터는 리소스 확보를 위한 인터럽트를 거는 용도로 사용되고 유실

> 연결 확립은 TCP, 실제 데이터만 UDP이용?

## ARP
IP주소, MAC 주소를 연계시켜주는 메커니즘 필요 이때 사용되는 프로토콜
물리적, 논리적 주소 연결
ARP 브로드캐스트를 이용해 네트워크 전체에 상대방의 MAC 주소를 질의, 목적지는 자신의MAC 주소를 ARP 프로토콜을 이용해 응답함
- 패킷을 저장할 때마다 ARP 브로드캐스트를 수행하면 네트워크 동신의 효율성이 저하, 메모리에 정보를 저장하고 재사용
- 성능 유지를 위해 ARP 테이블을 오래 유지하는 것이 좋지만 논리 주소는 바뀔 수 있으므로 일정 시간 동안 통신이 없으면 자동삭제
- ARP은 CPU에서 직접 수행, 많은 요청이 들어오면 네트워크 장비에서 큰 부하가 발생
### GARP & RARP
ARP 프로토콜 필드를 그대로 사용해, 내용을 변경해 원래 목적과 다르게 사용하는 프로토콜
GARP - 자신의 IP & MAC 주소를 알릴 목적
알리는 이유
  - IP 주소 충돌 감지
    - 자신이 사용하는 것이 이미 사용되고 있는지 GARP 통해 확인
  - 상대방의 ARP 테이블 갱신
    - 가상 MAC 주소를 사용하지 않는 데이터 베이스 HA 솔루션에서 주로 사용

  - HA(고가용성) 용도의 클러스터링 VRRP, HSRP
RARP IP 주소가 정해져 있지 않은 단말이 IP 할당을 요청할 때 사용
현재는 BOOTH와 DHCP로 대체되어 사용되지 않음
