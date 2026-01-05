/**
 * login.js (수정된 최종 버전)
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = loginModal.querySelector('.close-button');
    const submitBtn = loginModal.querySelector('.submit-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authButtonsContainer = document.getElementById('authButtons'); // 핵심: 이 컨테이너를 변경합니다.

    const USER_NICKNAME_KEY = 'userNickname';

    // 1. UI 업데이트 함수 정의 (로그인 상태에 따라 화면 변경)
    function updateAuthUI(isLoggedIn, nickname = '') {
        // 기존 내용 제거
        authButtonsContainer.innerHTML = '';

        if (isLoggedIn) {
            // 닉네임과 로그아웃 버튼 표시
            const htmlContent = `
                <span class="user-nickname" style="margin-right: 15px; font-weight: bold;">${nickname}</span>
                <button class="logout-button" id="logoutBtn">로그아웃</button>
            `;
            authButtonsContainer.innerHTML = htmlContent;
            
            // 새로 생성된 로그아웃 버튼에 이벤트 리스너 연결
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        } else {
            // 로그인/회원가입 버튼 표시 (로그아웃 시 복구)
            const htmlContent = `
                <button class="login-button" id="loginBtn">로그인</button>
                <a href="/signup" class="signup-button">회원가입</a>
            `;
            authButtonsContainer.innerHTML = htmlContent;
            
            // 새로 생성된 로그인 버튼에 모달 열기 이벤트 다시 연결
            document.getElementById('loginBtn').addEventListener('click', () => {
                loginModal.style.display = 'block';
            });
        }
    }

    // 2. 로그아웃 처리 함수
    function handleLogout() {
        // 토큰 및 닉네임 제거
        localStorage.removeItem('authToken');
        localStorage.removeItem(USER_NICKNAME_KEY);

        // UI 업데이트 (로그아웃 상태로 전환)
        updateAuthUI(false);

        alert('로그아웃 되었습니다.');
        // 필요하다면 페이지 리디렉션
        // window.location.href = '/'; 
    }

    // --- 초기 로딩 시 상태 확인 ---
    const storedToken = localStorage.getItem('authToken');
    const storedNickname = localStorage.getItem(USER_NICKNAME_KEY);
    
    // 페이지 로드 시 로그인 상태 확인 및 UI 반영
    if (storedToken && storedNickname) {
        updateAuthUI(true, storedNickname);
    } else {
        updateAuthUI(false);
    }
    
    // --- 모달 제어 로직 (기존과 동일) ---

    // Note: loginBtn은 초기 로드 시 updateAuthUI(false)에 의해 생성되므로, 이벤트는 그 안에서 연결됩니다.

    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // --- 로그인 제출 처리 로직 ---
    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault(); 

        const id = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!id || !password) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        const LOGIN_API_URL = '/api/login'; 
        
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // 🔔 중요: 백엔드에서 받은 닉네임을 사용합니다. (예시로 'data.nickname' 사용)
                const nickname = data.nickname || id; 

                // 토큰 및 닉네임 저장
                localStorage.setItem('authToken', data.token); 
                localStorage.setItem(USER_NICKNAME_KEY, nickname); 
                
                // UI 업데이트 (닉네임/로그아웃 버튼 표시)
                updateAuthUI(true, nickname);
                
                alert(`로그인 성공! 환영합니다, ${nickname}님.`);
                loginModal.style.display = 'none';
                
            } else {
                const errorData = await response.json();
                alert(`로그인 실패: ${errorData.message || '아이디 또는 비밀번호가 올바르지 않습니다.'}`);
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    });
});