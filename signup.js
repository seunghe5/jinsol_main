document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('.signup-form'); // 폼 선택자 확인
  const registrationMessage = document.createElement('div'); // 메시지 표시 영역 생성
  signupForm.parentNode.insertBefore(registrationMessage, signupForm.nextSibling); // 폼 아래에 메시지 영역 추가

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value; // HTML의 id는 'id'이지만 백엔드 컬럼은 'username'입니다.
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value; // HTML의 id는 'contact'이지만 백엔드 컬럼은 'phone_number'입니다.

    try {
      const response = await fetch('/api/register', { // 백엔드 API 주소
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: name, // HTML의 'name' 필드를 백엔드의 'nickname'으로 사용
          username: id,   // HTML의 'id' 필드를 백엔드의 'username'으로 사용
          password: password,
          address: address,
          phone_number: contact // HTML의 'contact' 필드를 백엔드의 'phone_number'로 사용
        })
      });

      const data = await response.json();

      if (response.ok) {
        registrationMessage.textContent = data.message; // 성공 메시지 표시
        signupForm.reset(); // 폼 초기화
      } else {
        registrationMessage.textContent = data.message || '회원 가입에 실패했습니다.'; // 실패 메시지 표시
      }

    } catch (error) {
      console.error('회원 가입 요청 오류:', error);
      registrationMessage.textContent = '서버와 통신 중 오류가 발생했습니다.';
    }
  });
});

