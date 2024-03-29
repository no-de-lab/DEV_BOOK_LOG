## HTTP/2.0
HTTP/1.1은 커넥션 통해 하나의 요청과 하나의 응답만을 할 수 있음 
  -> 심각한 회전 지연 문제 발생
  -> 이 문제를 해결하기 위해 병렬 커넥션과 파이프라인 커넥션을 도입되었지만 성능 개선에 대한 근본적인 해결책은 되지 못함
  -> 구글의 SPDY의 실험적인 프로토콜을 기반으로 HTTP/2.0 프로토콜을 설계


### 특징
- 바이너리기반 프로토콜
- 요청과 응답은 길이가 정의된 한개 이상의 프레임에 담긴다. 이때 헤더 압축(대역폭 절약)
  프레임에 담긴 요청과 응답은 스트림 통해 보내짐(한 개의 스트림이 한 쌍의 요청과 응답을 처리 )
  하나의 커넥션(tcp) 위에서 여러 개의 스트림이 동시에 만들어 질 수 있기에 요청과 응답을 동시에 처리 가능 
- 클라이언트 요청없이 서버측에서 클라에게 푸쉬가능

### 차이점
- binary framing
  - HTTP/2.0에서 모든 메시지는 프레임에 담겨 전송
  - 10가지 프레임 정의 ( 더 찾아보기)
- stream & multiflexing
  - 스트림은 HTTP/2.0 커넥션을 통해 클라이언트와 서버 사이에서 교환되는 프레임들의 독립된 양방향 시퀀스
  - 새로 만들어지는 스트림의 식별자는 이전보다 커야함, 그렇지 않다면 PROTOCOL_ERROR
  - 스트림 식별자 재사용 할 수 없음
  - 식별자 고갈될 경우 새로운 커넥션 맺으면 됨
- 헤더압축
  - HPACK에 정의된 방법으로 헤더 압축된 두 헤더블록조각으로 쪼개서 전송
- 서버푸쉬
  - PUSH_PROMISE 프레임으로 서버에서 푸쉬
  - 클라가 받으면 예약됨 상태
  - 클라가 거절을 원하면 RST_STREAM 프레임을 보내서 거절


### HOLB (Head of line Blocking)
TCP 패킷이 네트워크 경로에서 손실되면 스트림에 공백이 생긴다.
손실 된 바이트 다음에 오는 올바른 바이트들도 재전송으로 인해 전달이 되지 않아 발생하는 불필요한 지연
프로토콜이 TCP를 사용한는 한 피해갈 수 없는 문제
 


### HTTP/3
기반 프로토콜을 UDP를 사용, 정확하게는 UDP를 기반으로 하는 QUIC를 사용한다.
### QUIC
- 스트림 연결과 암호화 스펙등을 포함한 모든 핸드쉐이크가 단일 요청/응답으로 끝남
- 패킷이 개별적으로 암호화 되며, 다른 데이터 부분의 패킷을 기다릴 필요가 없음
- 통신이 멀티플렉싱 되며 이를 통해 HOLB를 극복
- QUIC는 운영체제 커널과 독립적으로 응용 프로그램 공간내에서 구현할 수 있으며, 덕분에 데이터의 이동에 따른 컨텍스트 전환에 의한 오버헤드가 없어짐
- Source Address와 무관하게 서버에 대한 연결을 고유하게 식별하는 연결 식별자가 포함되어 있어, IP주소가 변경되더라도 커넥션을 유지

[http 차이](https://dkrnfls.tistory.com/289)
[HTTP/2에서 Frame, Stream의 의미](https://brunch.co.kr/@sangjinkang/3)
[HTTP/3와 QUIC 이해](https://m.blog.naver.com/sehyunfa/221680799006)








- 스푸핑
가짜 페이지가 크롤러를 더 잘 속이고, 이에 따라 크롤러도 진화하는 끊없는 싸움을 스푸핑