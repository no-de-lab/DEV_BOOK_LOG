cpu를 가상화하는 단계에서 limited direct execution이라는, 프로그램이 하드웨어에서 직접 도는 개념이 있었다. 
그러나 시스템 콜이나, 인터럽트가 발생하면 OS가 참여해서 효율적인 가상화를 이루게끔 해준다. 

메모리를 가상화하는 것도 똑같다. 
효율적으로 하드웨어 이용하면서도 os가 제어권을 가져온다. 거기에, 유연성개념도 추가해서 프로그램이 그들의 주소 공간을 원할 때 사용하게끔 한다. 

하드웨어는 각 메모리 변환을 할 때 가상 주소를 물리 주소로 바꾼다. 하드웨어 혼자로는 할 수 없고, OS가 정확한 전환을 위해 필요하다. 

결국 이를 하는 이유는 다음과 같다: 프로그램은 자신의 고유 메모리가 있다는 착각을 하게 하지만, 사실은 가상 메모리고, 많은 프로그램이 메모리를 공유하고 있을 분이고, cpu가 돌아가는 메모리들 사이를 스위칭하는 것이다. 

## 가정
- 프로그램의 주소 공간이 연속적으로 있어야 한다. 
- 물리적 메모리 사이즈보다 작다. 
- 각 주소 공간은 다 똑같은 사이즈다.

라는 가정으로 시작한다. 

## 예시
프로그램의 입장에서는 주소공간이 0에서 시작하여 16KB를 최대로 하겠으나, 사실 가상 메모리는 반드시 0에 위치하지는 않는다. 
프로세스에게는 보이지 않고 재분배를 해야한다. 

## 다이나믹 relocation(hardware-based)
- 1950년대에 만들어진 base and bounds라는 개념이 있다. 
  - dynamic relocation이라 불린다. 
  - base와 bound라는 레지스터
  - 프로그램이 시행되면 os는 물리적 메모리 위치를 결정하여 base register값을 결정한다. 
  - 프로세스가 가지는 메모리 레퍼런스는 가상 주소다. 거기에 base register를 더해야 물리적 주소가 된다. 
  - 이 과정을 주소 변환이라 한다. 이것이 런타임에 이루어지고, 주소 공간을 옮길 수 있기때문에(프로세스 시행 후) 이를 dynamic relocation이라고도 한다.
  - bound는 해당 프로세스의 크기가 적절한지 확인한다. 프로세서는 메모리 레퍼런스가 바운드 안에 있는지를 확인한다.  
  - 이 base, bounds를 묶어 mmu라고 도 한다. 